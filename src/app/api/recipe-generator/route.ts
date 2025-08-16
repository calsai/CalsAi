import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const {
      preferences,
      meal_type,
      time_limit,
      available_ingredients,
      user_profile,
    } = await request.json();

    // Verifică autentificarea
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Nu ești autentificat" },
        { status: 401 }
      );
    }

    if (!preferences?.trim()) {
      return NextResponse.json(
        { success: false, error: "Te rog să descrii ce fel de rețetă vrei" },
        { status: 400 }
      );
    }

    // Construiește prompt-ul pentru AI
    const userInfo = user_profile
      ? `
Informații despre utilizator:
- Vârsta: ${user_profile.age} ani
- Greutatea: ${user_profile.weight} kg
- Înălțimea: ${user_profile.height} cm
- Sexul: ${user_profile.gender === "male" ? "masculin" : "feminin"}
- Nivelul de activitate: ${user_profile.activity_level}
- Obiectivul: ${
          user_profile.goal === "lose"
            ? "slăbire"
            : user_profile.goal === "gain"
            ? "creștere în greutate"
            : "menținere"
        }
- Necesarul caloric zilnic: ${user_profile.daily_calorie_goal} kcal
`
      : "";

    const timeConstraint = time_limit
      ? `\n- Timpul maxim de preparare + gătire: ${time_limit} minute`
      : "";
    const ingredientsConstraint = available_ingredients
      ? `\n- Ingrediente disponibile: ${available_ingredients}`
      : "";
    const mealTypeConstraint =
      meal_type && meal_type !== "orice" ? `\n- Tipul mesei: ${meal_type}` : "";

    const prompt = `Ești un chef profesionist și nutriționist român. Generează o rețetă detaliată bazată pe următoarele cerințe:

CERINȚA UTILIZATORULUI: "${preferences}"

CONSTRÂNGERI:${mealTypeConstraint}${timeConstraint}${ingredientsConstraint}

${userInfo}

Te rog să generezi o rețetă care să fie:
1. Adaptată culturii culinare românești
2. Sănătoasă și echilibrată nutrițional
3. Practică pentru preparare acasă
4. Adaptată obiectivelor utilizatorului

Răspunde EXACT în următorul format JSON (fără text suplimentar):

{
  "name": "Numele rețetei în română",
  "description": "O descriere scurtă și atrăgătoare a rețetei",
  "prep_time": [numărul de minute pentru preparare],
  "cook_time": [numărul de minute pentru gătire],
  "servings": [numărul de porții],
  "calories_per_serving": [caloriile per porție],
  "protein_per_serving": [gramele de proteine per porție],
  "carbs_per_serving": [gramele de carbohidrați per porție],
  "fat_per_serving": [gramele de grăsimi per porție],
  "ingredients": [
    "ingredient 1 cu cantitatea exactă",
    "ingredient 2 cu cantitatea exactă",
    "..."
  ],
  "instructions": [
    "Pasul 1 detaliat",
    "Pasul 2 detaliat",
    "..."
  ],
  "tags": ["tag1", "tag2", "tag3"]
}`;

    // Apelează AI-ul
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // Parseaza răspunsul JSON
    let recipe;
    try {
      // Extrage JSON din răspuns (în caz că AI-ul adaugă text suplimentar)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Nu s-a putut extrage JSON din răspuns");
      }
      recipe = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Nu am putut genera rețeta. Te rog să încerci din nou cu o descriere mai specifică.",
        },
        { status: 500 }
      );
    }

    // Validează datele rețetei
    if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
      return NextResponse.json(
        {
          success: false,
          error: "Rețeta generată este incompletă. Te rog să încerci din nou.",
        },
        { status: 500 }
      );
    }

    // Salvează rețeta în baza de date
    const { error: insertError } = await supabase.from("recipes").insert({
      user_id: user.id,
      name: recipe.name,
      description: recipe.description,
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 1,
      calories_per_serving: recipe.calories_per_serving || 0,
      protein_per_serving: recipe.protein_per_serving || 0,
      carbs_per_serving: recipe.carbs_per_serving || 0,
      fat_per_serving: recipe.fat_per_serving || 0,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      tags: recipe.tags || [],
      ai_generated: true,
      prompt_used: preferences,
    });

    if (insertError) {
      console.error("Error saving recipe:", insertError);
    }

    return NextResponse.json({
      success: true,
      recipe: recipe,
    });
  } catch (error) {
    console.error("Error in recipe generator:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la generarea rețetei",
      },
      { status: 500 }
    );
  }
}
