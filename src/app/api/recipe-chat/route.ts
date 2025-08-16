import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const openai = new OpenAI({ 
  baseURL: endpoint, 
  apiKey: token 
});

export async function POST(request: NextRequest) {
  try {
    const { message, foodHistory } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = `
Ești un chef expert în bucătăria românească și internațională.

CERINȚA UTILIZATORULUI: "${message}"

${
  foodHistory && foodHistory.length > 0
    ? `
ISTORIC ALIMENTAR RECENT: ${foodHistory.slice(-10).join(", ")}
`
    : ""
}

SARCINA TA:
1. Analizează cerința utilizatorului pentru rețete
2. Ia în considerare orice alergii, preferințe sau restricții menționate
3. Sugerează 2-3 rețete potrivite

Returnează un JSON în acest format EXACT:
{
  "response": "răspuns prietenos în română cu max 100 cuvinte",
  "recipes": [
    {
      "name": "Numele rețetei",
      "ingredients": ["ingredient 1", "ingredient 2", "..."],
      "instructions": "Pași de preparare în română",
      "calories": număr_calorii_per_porție,
      "prepTime": număr_minute_preparare
    }
  ]
}

REGULI:
- Răspunde în română, profesional și prietenos
- Rețetele să fie practice și sănătoase
- Caloriile să fie realiste (200-800 cal/porție)
- Timpul de preparare realist (10-60 min)
- Maxim 10 ingrediente per rețetă
- Instrucțiuni clare și concise
`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Ești un chef expert în bucătăria românească și internațională care oferă sfaturi despre rețete."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    try {
      // Extrage JSON din răspuns
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
          success: true,
          response:
            result.response || "Am găsit câteva rețete pentru dumneavoastră!",
          recipes: result.recipes || [],
        });
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
    }

    // Fallback response
    return NextResponse.json({
      success: true,
      response: "Îmi pare rău, nu am putut genera rețete acum. Te rog să încerci din nou cu o descriere mai specifică.",
      recipes: [],
    });
  } catch (error) {
    console.error("GitHub AI API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la generarea rețetelor",
      },
      { status: 500 }
    );
  }
}
