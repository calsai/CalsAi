import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Tipuri pentru structura de date
interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: string;
}

// Funcție pentru analiza nutrițională cu Perplexity AI
async function analyzeNutritionWithAI(message: string) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return null;
  }

  const nutritionPrompt = `
Analizează următorul mesaj și extrage informațiile nutriționale DOAR dacă sunt menționate alimente concrete cu cantități:

"${message}"

Dacă găsești alimente cu cantități, răspunde DOAR cu un JSON valid în acest format:
{
  "foods": [
    {
      "name": "nume aliment cu cantitate",
      "calories": număr_calorii,
      "protein": grame_proteine,
      "carbs": grame_carbohidrați,
      "fat": grame_grăsimi,
      "meal_time": "dimineata|amiaza|seara"
    }
  ]
}

Dacă NU găsești alimente concrete cu cantități, răspunde cu:
{"foods": []}

Calculează valorile nutriționale realiste și precise. Nu inventa date.
`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "Ești un expert nutriționist care analizează mesajele pentru extragerea precisă a informațiilor nutriționale. Răspunzi DOAR cu JSON valid.",
          },
          {
            role: "user",
            content: nutritionPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("Perplexity nutrition analysis error:", response.status);
      return null;
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) return null;

    // Încearcă să parseze JSON-ul returnat de AI
    try {
      const nutritionData = JSON.parse(aiResponse.trim());
      return nutritionData.foods || [];
    } catch (parseError) {
      console.error("Failed to parse AI nutrition response:", parseError);
      return null;
    }
  } catch (error) {
    console.error("AI nutrition analysis error:", error);
    return null;
  }
}

// Funcție pentru apelul către Perplexity API cu fetch direct
async function callPerplexityAPI(message: string) {
  console.log(
    "PERPLEXITY_API_KEY:",
    process.env.PERPLEXITY_API_KEY ? "SET" : "NOT SET"
  );
  console.log("Token length:", process.env.PERPLEXITY_API_KEY?.length || 0);

  if (!process.env.PERPLEXITY_API_KEY) {
    return "Îmi pare rău, nu am acces la serviciul AI momentan. Te rog să verifici configurația.";
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "Ești un coach personal de nutriție profesional și expert în română. Vorbești profesional și prietenos, ești motivant dar echilibrat, dai sfaturi practice și bazate pe știință, ești empatic și înțelegător.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error(
        "Perplexity API error:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou! 😔";
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content || "Nu am putut genera un răspuns."
    );
  } catch (error) {
    console.error("GitHub AI API error:", error);
    return "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou! 😔";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Încearcă să obții utilizatorul autentificat pentru salvare (opțional)
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Analizează mesajul cu AI pentru extragerea informațiilor nutriționale
    const detectedFoods = await analyzeNutritionWithAI(message);

    // Dacă utilizatorul este autentificat și AI-ul a detectat alimente, salvează-le
    if (user && detectedFoods && detectedFoods.length > 0) {
      const journalEntries = detectedFoods.map((food: FoodEntry) => ({
        user_id: user.id,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        meal_time: food.meal_time,
        date: new Date().toISOString().split("T")[0],
        confirmed: true,
      }));

      // Salvează în jurnal
      await supabase.from("food_entries").insert(journalEntries);
    }

    // Apelează Perplexity AI pentru răspunsul conversațional
    const aiResponse = await callPerplexityAPI(message);

    return NextResponse.json({
      response: aiResponse,
      success: true,
      foodsDetected: detectedFoods ? detectedFoods.length > 0 : false,
      savedEntries: user && detectedFoods ? detectedFoods : [],
    });
  } catch (error: unknown) {
    console.error("Error in chat:", error);

    // Fallback răspuns dacă AI nu funcționează
    const fallbackResponses = [
      "Îmi pare rău, am o problemă tehnică momentan. Pot să te ajut cu ceva simplu despre nutriție? 🍎",
      "Nu reușesc să mă conectez la serviciul AI acum. Ce întrebare ai despre alimentația sănătoasă? 🥗",
      "Am o mică problemă tehnică. Spune-mi ce vrei să știi despre dietă și îți răspund! 💪",
    ];

    return NextResponse.json({
      response:
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      success: false,
    });
  }
}
