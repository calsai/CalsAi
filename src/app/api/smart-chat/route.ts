import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const openai = new OpenAI({ 
  baseURL: endpoint, 
  apiKey: token 
});

// Funcție pentru extragerea alimentelor din mesaj
function extractFoodsFromMessage(message: string) {
  const foods = [];

  // Pattern pentru alimente cu cantități
  const foodPatterns = [
    {
      pattern: /(\d+)\s*(felii?|felie)\s*(de\s+)?pâine/gi,
      food: "Pâine",
      calories: 80,
      unit: "felie",
    },
    { pattern: /(\d+)\s*ouă?/gi, food: "Ouă", calories: 70, unit: "bucată" },
    {
      pattern: /(\d+)g?\s*(de\s+)?pui/gi,
      food: "Piept de pui",
      caloriesPer100g: 165,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?orez/gi,
      food: "Orez fiert",
      caloriesPer100g: 130,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?paste/gi,
      food: "Paste",
      caloriesPer100g: 350,
    },
    {
      pattern: /(\d+)ml?\s*(de\s+)?lapte/gi,
      food: "Lapte",
      caloriesPer100ml: 64,
    },
    {
      pattern: /(\d+)\s*(mere?|măr)/gi,
      food: "Măr",
      calories: 80,
      unit: "bucată",
    },
    {
      pattern: /(\d+)\s*banane?/gi,
      food: "Banană",
      calories: 90,
      unit: "bucată",
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?brânză/gi,
      food: "Brânză",
      caloriesPer100g: 230,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?roșii/gi,
      food: "Roșii",
      caloriesPer100g: 18,
    },
    {
      pattern: /(\d+)g?\s*(de\s+)?salată/gi,
      food: "Salată verde",
      caloriesPer100g: 15,
    },
  ];

  for (const {
    pattern,
    food,
    calories,
    caloriesPer100g,
    caloriesPer100ml,
    unit,
  } of foodPatterns) {
    const matches = message.matchAll(pattern);

    for (const match of matches) {
      const quantity = parseInt(match[1]);
      if (isNaN(quantity) || quantity <= 0) continue;

      let totalCalories = 0;

      if (calories) {
        totalCalories = quantity * calories;
      } else if (caloriesPer100g) {
        totalCalories = (quantity * caloriesPer100g) / 100;
      } else if (caloriesPer100ml) {
        totalCalories = (quantity * caloriesPer100ml) / 100;
      }

      foods.push({
        food: `${food} - ${quantity}${unit || "g"}`,
        calories: Math.round(totalCalories),
        rawFood: food,
        quantity,
      });
    }
  }

  return foods;
}

// Funcție pentru determinarea mesei bazată pe ora curentă
function getCurrentMealTime(): "dimineata" | "amiaza" | "seara" {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return "dimineata";
  } else if (hour >= 12 && hour < 18) {
    return "amiaza";
  } else {
    return "seara";
  }
}

async function callGitHubAI(
  message: string,
  extractedFoods: {
    food: string;
    calories: number;
    rawFood: string;
    quantity: number;
  }[]
) {
  const foodsList = extractedFoods
    .map((f) => `${f.food} (${f.calories} calorii)`)
    .join(", ");

  const prompt = `Ești un asistent nutrițional inteligent. Utilizatorul a spus: "${message}"

${extractedFoods.length > 0 ? `Am detectat aceste alimente: ${foodsList}` : ""}

Te rog să răspunzi într-un mod prietenos și util, oferind sfaturi nutriționale practice. Răspunsul tău ar trebui să fie:
- Natural și conversațional
- Scurt (maxim 100 de cuvinte)
- Util și practic
- În română

Nu folosi bullet points sau formatări artificiale. Răspunde ca un prieten care îți dă sfaturi despre nutriție.`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Ești un asistent nutrițional prietenos și util care oferă sfaturi practice despre alimentație."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || "Îmi pare rău, nu am putut răspunde acum.";
  } catch (error) {
    console.error("GitHub AI API error:", error);
    return "Îmi pare rău, am o problemă tehnică. Dar spune-mi, cum te simți astăzi din punct de vedere alimentar?";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Extrage alimentele din mesaj
    const extractedFoods = extractFoodsFromMessage(message);

    // Determină timpul mesei
    const mealTime = getCurrentMealTime();

    // Creează intrările pentru jurnal
    const journalEntries = extractedFoods.map((food) => ({
      id: `${Date.now()}-${Math.random()}`,
      food: food.food,
      calories: food.calories,
      time: mealTime,
      timestamp: new Date(),
    }));

    // Dacă avem userId, salvează în baza de date
    if (userId && extractedFoods.length > 0) {
      try {
        const today = new Date().toISOString().split("T")[0];

        for (const food of extractedFoods) {
          await db.addFoodEntry(userId, {
            food: food.food,
            calories: food.calories,
            protein: undefined,
            carbs: undefined,
            fat: undefined,
            time: mealTime,
            date: today,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
        // Continuă și returnează răspunsul chiar dacă salvarea în DB a eșuat
      }
    }

    // Apelează Gemini API pentru răspuns
    const aiResponse = await callGitHubAI(message, extractedFoods);

    return NextResponse.json({
      response: aiResponse,
      journalEntries: journalEntries,
      mealTime: mealTime,
      success: true,
    });
  } catch (error) {
    console.error("Error in smart chat:", error);

    return NextResponse.json(
      {
        response:
          "Îmi pare rău, am o problemă tehnică. Vă rog să încercați din nou.",
        journalEntries: [],
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
