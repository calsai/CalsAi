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
    const { foodName, calories } = await request.json();

    if (!foodName || !calories) {
      return NextResponse.json(
        { error: "Food name and calories are required" },
        { status: 400 }
      );
    }

    const prompt = `
Estimează macronutrienții pentru "${foodName}" cu ${calories} calorii.

Returnează DOAR un JSON în acest format exact:
{
  "protein": număr_grame,
  "carbs": număr_grame,
  "fat": număr_grame
}

Reguli:
- Estimează pe baza tipului de aliment și caloriilor date
- Folosește valori realiste pentru alimente românești
- Returnează DOAR JSON-ul, fără alt text
`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Ești un expert în nutriție care estimează macronutrienții pentru alimente."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    try {
      // Extrage JSON din răspuns
      const jsonMatch = responseText.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const macros = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
          success: true,
          protein: parseFloat(macros.protein) || 0,
          carbs: parseFloat(macros.carbs) || 0,
          fat: parseFloat(macros.fat) || 0,
        });
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
    }

    // Fallback - estimări simple bazate pe calorii
    const estimatedProtein = Math.round((calories * 0.15) / 4); // 15% din calorii ca proteine
    const estimatedCarbs = Math.round((calories * 0.5) / 4); // 50% din calorii ca carbohidrați
    const estimatedFat = Math.round((calories * 0.35) / 9); // 35% din calorii ca grăsimi

    return NextResponse.json({
      success: true,
      protein: estimatedProtein,
      carbs: estimatedCarbs,
      fat: estimatedFat,
    });
  } catch (error) {
    console.error("GitHub AI API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
