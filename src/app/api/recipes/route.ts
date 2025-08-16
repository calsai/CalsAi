import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const openai = new OpenAI({ 
  baseURL: endpoint, 
  apiKey: token 
});

async function generateRecipesWithAI(
  foodHistory: string[],
  preferences: string[]
) {
  const prompt = `
Ești un chef profesionist român și expert în nutriție. 

CONTEXT:
- Istoricul alimentar recent: ${foodHistory.join(", ") || "Nu există istoric"}
- Preferințe: ${preferences.join(", ") || "Nu sunt specificate"}

SARCINA:
Generează 3 rețete sănătoase românești personalizate.

FORMAT RĂSPUNS (JSON valid):
{
  "recipes": [
    {
      "name": "Nume rețetă",
      "ingredients": ["ingredient1 - cantitate", "ingredient2 - cantitate"],
      "instructions": "Pași detaliați de preparare",
      "calories": numărul_de_calorii,
      "prepTime": timpul_în_minute
    }
  ]
}

REGULI:
- Doar rețete românești 
- Ingrediente disponibile în România
- Călcule precise pentru calorii
- Răspuns doar în JSON valid
`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Ești un chef profesionist român și expert în nutriție care generează rețete sănătoase personalizate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || "{}";

    const cleanResponse = aiResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const parsedResponse = JSON.parse(cleanResponse);
      return parsedResponse.recipes || [];
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return [
        {
          name: "Ciorbă de legume",
          ingredients: [
            "Morcovi - 2 bucăți",
            "Țelină - 100g",
            "Cartofi - 200g",
          ],
          instructions:
            "Curățați și tăiați legumele. Fierbeți timp de 30 minute.",
          calories: 120,
          prepTime: 45,
        },
      ];
    }
  } catch (error) {
    console.error("GitHub AI API error:", error);
    return [
      {
        name: "Salată de sezon",
        ingredients: [
          "Salată verde - 150g",
          "Roșii - 2 bucăți",
          "Castraveți - 1 bucată",
        ],
        instructions: "Spălați legumele și tăiați-le. Amestecați și serviți.",
        calories: 80,
        prepTime: 15,
      },
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { foodHistory, preferences } = await request.json();

    const recipes = await generateRecipesWithAI(
      foodHistory || [],
      preferences || []
    );

    return NextResponse.json({
      recipes,
      success: true,
    });
  } catch (error: any) {
    console.error("Error generating recipes:", error);

    return NextResponse.json(
      {
        recipes: [],
        success: false,
        error: "Nu am putut genera rețete momentan",
      },
      { status: 500 }
    );
  }
}
