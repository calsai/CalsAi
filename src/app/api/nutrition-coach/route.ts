import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const openai = new OpenAI({ 
  baseURL: endpoint, 
  apiKey: token 
});

// Funcție pentru extragerea alimentelor din mesaj și adăugarea în jurnal
async function extractAndSaveFoodFromMessage(message: string, userId: string) {
  const messageL = message.toLowerCase();
  const foodEntries = [];

  // Pattern matching pentru alimente comune românești
  const foodPatterns = [
    // Pâine
    {
      pattern: /(\d+)\s*(felii?|felie)\s*(de\s+)?pâine/gi,
      food: "Pâine albă",
      calsPerUnit: 80,
      unit: "felie",
    },
    { pattern: /(\d+)g?\s*pâine/gi, food: "Pâine albă", calsPer100g: 265 },

    // Ouă
    {
      pattern: /(\d+)\s*ouă?/gi,
      food: "Ou de găină",
      calsPerUnit: 70,
      unit: "bucată",
    },

    // Pui
    {
      pattern: /(\d+)g?\s*(de\s+)?pui/gi,
      food: "Piept de pui",
      calsPer100g: 165,
    },
    {
      pattern: /(\d+)g?\s*piept\s*(de\s+)?pui/gi,
      food: "Piept de pui",
      calsPer100g: 165,
    },

    // Orez
    {
      pattern: /(\d+)g?\s*(de\s+)?orez/gi,
      food: "Orez fiert",
      calsPer100g: 130,
    },

    // Paste
    { pattern: /(\d+)g?\s*(de\s+)?paste/gi, food: "Paste", calsPer100g: 350 },
    { pattern: /(\d+)g?\s*spaghete/gi, food: "Spaghete", calsPer100g: 350 },

    // Lapte
    {
      pattern: /(\d+)ml?\s*(de\s+)?lapte/gi,
      food: "Lapte 3.5%",
      calsPer100ml: 64,
    },
    {
      pattern: /un?\s*pahar\s*(de\s+)?lapte/gi,
      food: "Lapte 3.5%",
      calsPerUnit: 160,
      unit: "pahar (250ml)",
    },

    // Brânză
    {
      pattern: /(\d+)g?\s*(de\s+)?brânză/gi,
      food: "Brânză telemea",
      calsPer100g: 230,
    },
    { pattern: /(\d+)g?\s*cașcaval/gi, food: "Cașcaval", calsPer100g: 350 },

    // Unt
    { pattern: /(\d+)g?\s*(de\s+)?unt/gi, food: "Unt", calsPer100g: 717 },

    // Legume
    { pattern: /(\d+)g?\s*(de\s+)?roșii/gi, food: "Roșii", calsPer100g: 18 },
    {
      pattern: /(\d+)g?\s*(de\s+)?castraveți/gi,
      food: "Castraveți",
      calsPer100g: 12,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?salată/gi,
      food: "Salată verde",
      calsPer100g: 15,
    },

    // Fructe
    {
      pattern: /(\d+)\s*(mere?|măr)/gi,
      food: "Măr",
      calsPerUnit: 80,
      unit: "bucată",
    },
    {
      pattern: /(\d+)\s*banane?/gi,
      food: "Banană",
      calsPerUnit: 90,
      unit: "bucată",
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?struguri/gi,
      food: "Struguri",
      calsPer100g: 62,
    },

    // Cafea și băuturi
    {
      pattern: /(\d+)\s*(căni|cești)\s*(de\s+)?cafea/gi,
      food: "Cafea neagră",
      calsPerUnit: 2,
      unit: "ceașcă",
    },
    {
      pattern: /(\d+)ml?\s*(de\s+)?suc/gi,
      food: "Suc de fructe",
      calsPer100ml: 45,
    },

    // Dulciuri
    {
      pattern: /(\d+)g?\s*(de\s+)?ciocolată/gi,
      food: "Ciocolată",
      calsPer100g: 530,
    },
    {
      pattern: /(\d+)\s*prăjituri?/gi,
      food: "Prăjitură",
      calsPerUnit: 250,
      unit: "bucată",
    },

    // Carne
    {
      pattern: /(\d+)g?\s*(de\s+)?vită/gi,
      food: "Carne de vită",
      calsPer100g: 250,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?porc/gi,
      food: "Carne de porc",
      calsPer100g: 290,
    },

    // Pește
    { pattern: /(\d+)g?\s*(de\s+)?pește/gi, food: "Pește", calsPer100g: 180 },
    { pattern: /(\d+)g?\s*somon/gi, food: "Somon", calsPer100g: 200 },
  ];

  for (const {
    pattern,
    food,
    calsPerUnit,
    calsPer100g,
    calsPer100ml,
    unit,
  } of foodPatterns) {
    const matches = message.matchAll(pattern);

    for (const match of matches) {
      const quantity = parseInt(match[1]);
      if (isNaN(quantity) || quantity <= 0) continue;

      let calories = 0;
      let actualQuantity = quantity;

      if (calsPerUnit) {
        calories = quantity * calsPerUnit;
        actualQuantity = quantity;
      } else if (calsPer100g) {
        calories = (quantity * calsPer100g) / 100;
        actualQuantity = quantity;
      } else if (calsPer100ml) {
        calories = (quantity * calsPer100ml) / 100;
        actualQuantity = quantity;
      }

      // Adaugă în baza de date
      try {
        const entry = await prisma.foodEntry.create({
          data: {
            userId,
            foodName: food,
            quantity: actualQuantity,
            calories: Math.round(calories),
            protein: Math.round((calories * 0.15) / 4), // Estimare bazată pe calorii
            carbs: Math.round((calories * 0.5) / 4),
            fat: Math.round((calories * 0.3) / 9),
            date: new Date(),
          },
        });

        foodEntries.push({
          id: entry.id,
          foodName: food,
          quantity: actualQuantity,
          calories: Math.round(calories),
          unit: unit || "g",
        });
      } catch (error) {
        console.error("Error adding food entry:", error);
      }
    }
  }

  return foodEntries;
}

// Obține statisticile zilei
async function getTodayStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const entries = await prisma.foodEntry.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  return {
    calories: entries.reduce(
      (sum: number, entry: any) => sum + entry.calories,
      0
    ),
    protein: entries.reduce(
      (sum: number, entry: any) => sum + entry.protein,
      0
    ),
    carbs: entries.reduce((sum: number, entry: any) => sum + entry.carbs, 0),
    fat: entries.reduce((sum: number, entry: any) => sum + entry.fat, 0),
    count: entries.length,
    foods: entries.map((e: any) => e.foodName),
  };
}

// Obține istoricul alimentar pentru sugestii personalizate
async function getFoodHistory(userId: string) {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const entries = await prisma.foodEntry.findMany({
    where: {
      userId,
      date: {
        gte: lastWeek,
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 50,
  });

  const foodCounts: { [key: string]: number } = {};
  entries.forEach((entry: any) => {
    foodCounts[entry.foodName] = (foodCounts[entry.foodName] || 0) + 1;
  });

  return {
    recentFoods: entries.slice(0, 10).map((e: any) => e.foodName),
    favoriteFoods: Object.entries(foodCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([food]) => food),
  };
}

// Apel către GitHub AI
async function callGitHubAI(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Ești un coach personal de nutriție foarte prietenos și expert în română."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "Nu am putut genera un răspuns.";
  } catch (error) {
    console.error("GitHub AI API error:", error);
    return "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou!";
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 1. Extrage și salvează alimentele din mesaj
    const foodEntries = await extractAndSaveFoodFromMessage(
      message,
      session.user.id
    );

    // 2. Obține datele necesare pentru context
    const todayStats = await getTodayStats(session.user.id);
    const history = await getFoodHistory(session.user.id);

    // 3. Creează prompt-ul pentru Gemini
    const contextPrompt = `
Ești un coach personal de nutriție foarte prietenos și expert în română. 

CONTEXT UTILIZATOR:
- Calorii astăzi: ${todayStats.calories} cal
- Proteine: ${todayStats.protein}g, Carbohidrați: ${
      todayStats.carbs
    }g, Grăsimi: ${todayStats.fat}g
- Alimente consumate azi: ${
      todayStats.foods.length > 0 ? todayStats.foods.join(", ") : "nimic încă"
    }
- Alimente favorite: ${
      history.favoriteFoods.length > 0
        ? history.favoriteFoods.join(", ")
        : "încă nu am istoric"
    }

${
  foodEntries.length > 0
    ? `TOCMAI AM ADĂUGAT ÎN JURNAL: ${foodEntries
        .map((f) => `${f.foodName} (${f.calories} cal)`)
        .join(", ")}`
    : ""
}

MESAJUL UTILIZATORULUI: "${message}"

INSTRUCȚIUNI:
- Răspunde în română, prietenos și motivant
- Dacă am adăugat alimente, confirmă și dă sfaturi
- Oferă sugestii personalizate bazate pe preferințele istorice
- Dă sfaturi practice de nutriție
- Fii empatic și încurajator
- Folosește emoji-uri cu măsură
- Răspunsul să fie maxim 200 cuvinte
`;

    // 4. Apelează Gemini API
    const aiResponse = await callGitHubAI(contextPrompt);

    // 5. Returnează răspunsul
    return NextResponse.json({
      response: aiResponse,
      foodEntries: foodEntries,
      todayStats: todayStats,
    });
  } catch (error) {
    console.error("Error in nutrition coach:", error);
    return NextResponse.json(
      {
        response:
          "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou!",
        foodEntries: [],
        todayStats: null,
      },
      { status: 500 }
    );
  }
}
