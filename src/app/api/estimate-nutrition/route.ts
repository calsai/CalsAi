import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { foodDescription } = await request.json();
    const supabase = await createSupabaseServerClient();

    // Verifică autentificarea
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!foodDescription?.trim()) {
      return NextResponse.json(
        { error: "Food description is required" },
        { status: 400 }
      );
    }

    // Analizează cu Perplexity AI
    const nutrition = await analyzeNutritionWithAI(foodDescription);

    if (!nutrition) {
      // Fallback la estimarea simplă
      const estimated = estimateNutritionSimple(foodDescription);
      return NextResponse.json({
        success: true,
        nutrition: estimated,
        source: "estimated",
      });
    }

    return NextResponse.json({
      success: true,
      nutrition,
      source: "ai",
    });
  } catch (error) {
    console.error("Error in nutrition estimation:", error);
    return NextResponse.json(
      { success: false, error: "Technical error" },
      { status: 500 }
    );
  }
}

async function analyzeNutritionWithAI(foodDescription: string) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return null;
  }

  const nutritionPrompt = `
Analizează următoarea descriere de aliment și calculează valorile nutriționale exacte:

"${foodDescription}"

Răspunde DOAR cu un JSON valid în acest format:
{
  "calories": număr_calorii_total,
  "protein": grame_proteine_total,
  "carbs": grame_carbohidrați_total,
  "fat": grame_grăsimi_total
}

Ia în considerare cantitățile specificate (g, kg, felii, bucăți, etc.) și calculează totalul pentru toată porția menționată.
Folosește date nutriționale reale și precise.
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
              "Ești un expert nutriționist care calculează valorile nutriționale precise. Răspunzi DOAR cu JSON valid.",
          },
          {
            role: "user",
            content: nutritionPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error("Perplexity nutrition estimation error:", response.status);
      return null;
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) return null;

    try {
      const nutritionData = JSON.parse(aiResponse.trim());
      return {
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbs: nutritionData.carbs || 0,
        fat: nutritionData.fat || 0,
      };
    } catch (parseError) {
      console.error("Failed to parse AI nutrition response:", parseError);
      return null;
    }
  } catch (error) {
    console.error("AI nutrition estimation error:", error);
    return null;
  }
}

function estimateNutritionSimple(foodDescription: string) {
  const desc = foodDescription.toLowerCase();
  let calories = 100;
  let protein = 5;
  let carbs = 15;
  let fat = 3;

  // Extrage cantitățile
  const quantityMatch = desc.match(
    /(\d+(?:\.\d+)?)\s*(g|kg|felii?|bucăți?|bucata|ml|l)/i
  );
  let multiplier = 1;

  if (quantityMatch) {
    const quantity = parseFloat(quantityMatch[1]);
    const unit = quantityMatch[2].toLowerCase();

    if (unit.includes("kg")) {
      multiplier = quantity * 10; // 1kg = ~10 porții de 100g
    } else if (unit.includes("g")) {
      multiplier = quantity / 100; // standardizat la 100g
    } else if (unit.includes("felii") || unit.includes("felie")) {
      multiplier = quantity * 0.8; // o felie ≈ 80g
    } else if (unit.includes("bucăți") || unit.includes("bucata")) {
      multiplier = quantity;
    } else if (unit.includes("ml")) {
      multiplier = quantity / 100; // 100ml standard pentru lichide
    } else if (unit.includes("l")) {
      multiplier = quantity * 10; // 1L = 10 x 100ml
    }
  }

  // Pattern matching pentru tipuri de alimente
  if (desc.includes("ou")) {
    calories = 70;
    protein = 6;
    carbs = 1;
    fat = 5;
  } else if (desc.includes("pui") || desc.includes("piept")) {
    calories = 165;
    protein = 31;
    carbs = 0;
    fat = 3.6;
  } else if (desc.includes("pâine") || desc.includes("felie")) {
    calories = 250;
    protein = 9;
    carbs = 49;
    fat = 3.2;
  } else if (desc.includes("lapte")) {
    calories = 64;
    protein = 3.2;
    carbs = 4.8;
    fat = 3.6;
  } else if (desc.includes("brânză") || desc.includes("caș")) {
    calories = 280;
    protein = 25;
    carbs = 2;
    fat = 20;
  } else if (desc.includes("măr") || desc.includes("mere")) {
    calories = 52;
    protein = 0.3;
    carbs = 14;
    fat = 0.2;
  } else if (desc.includes("banană")) {
    calories = 89;
    protein = 1.1;
    carbs = 23;
    fat = 0.3;
  } else if (desc.includes("orez")) {
    calories = 130;
    protein = 2.7;
    carbs = 28;
    fat = 0.3;
  } else if (desc.includes("paste") || desc.includes("spaghete")) {
    calories = 131;
    protein = 5;
    carbs = 25;
    fat = 1.1;
  }

  return {
    calories: Math.round(calories * multiplier),
    protein: Math.round(protein * multiplier * 10) / 10,
    carbs: Math.round(carbs * multiplier * 10) / 10,
    fat: Math.round(fat * multiplier * 10) / 10,
  };
}
