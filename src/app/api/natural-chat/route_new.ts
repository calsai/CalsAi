import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Tipuri pentru date
interface FoodEntry {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_time?: string;
}

interface UserProfile {
  user_id: string;
  daily_calorie_goal?: number;
  weight_goal?: string;
  activity_level?: string;
  full_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
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

Dacă nu găsești alimente concrete cu cantități, răspunde DOAR cu:
{"foods": []}

Fii foarte precis cu cantitățile și calculează nutrienții corect.`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [{ role: "user", content: nutritionPrompt }],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extrage JSON din răspuns
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[0]);
      return jsonData.foods || [];
    }

    return [];
  } catch (error) {
    console.error("AI nutrition analysis error:", error);
    return null;
  }
}

// AI prompt natural pentru conversație
async function callPerplexityAPIForNaturalChat(
  message: string,
  detectedFoods: FoodEntry[],
  userProfile: UserProfile | null,
  conversationHistory: Array<{ role: string; content: string }> = []
) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return "Îmi pare rău, nu am acces la serviciul AI momentan.";
  }

  const firstName = userProfile?.full_name?.split(" ")[0] || "prietene";
  const currentHour = new Date().getHours();
  let contextualGreeting = "";

  if (currentHour < 12) contextualGreeting = "dimineața";
  else if (currentHour < 18) contextualGreeting = "la prânz";
  else contextualGreeting = "seara";

  let naturalPrompt = `Ești Alex, un nutriționist personal empatic și prietenos care lucrează cu ${firstName}.

MESAJUL DE ACUM: "${message}"`;

  if (detectedFoods.length > 0) {
    naturalPrompt += `\n\n🍽️ AM DETECTAT ACESTE ALIMENTE:\n`;
    naturalPrompt += detectedFoods
      .map(
        (f) =>
          `- ${f.name} (${f.calories} calorii, ${f.protein}g proteine, ${f.carbs}g carbo, ${f.fat}g grăsimi)`
      )
      .join("\n");
    naturalPrompt += `\n\nCONFIRMĂ-LE și adaugă-le în jurnalul alimentar automat!`;
  }

  if (userProfile) {
    naturalPrompt += `\n\nPROFILUL LUI ${firstName.toUpperCase()}:\n`;
    naturalPrompt += `- 🎯 Obiectiv: ${
      userProfile.goal === "lose"
        ? "Slăbire"
        : userProfile.goal === "gain"
        ? "Îngrășare"
        : "Menținere"
    }\n`;
    naturalPrompt += `- 📊 Calorii zilnice: ${
      userProfile.daily_calorie_goal || "necalculate"
    } cal\n`;
    naturalPrompt += `- 👤 ${userProfile.age || "?"}ani, ${
      userProfile.weight || "?"
    }kg, ${userProfile.height || "?"}cm`;
  }

  if (conversationHistory.length > 0) {
    naturalPrompt += `\n\nCONTEXT DIN CONVERSAȚIA ANTERIOARĂ:\n`;
    naturalPrompt += conversationHistory
      .slice(-3)
      .map(
        (h) =>
          `${h.role === "user" ? firstName : "Alex"}: ${h.content.substring(
            0,
            80
          )}...`
      )
      .join("\n");
  }

  naturalPrompt += `\n\nINSTRUCȚIUNI PENTRU RĂSPUNS:
1. Răspunde în ROMÂNĂ cu 2-4 propoziții, nu scrie eseuri lungi
2. Dacă ai detectat alimente, confirmă-le entuziast și explică valoarea lor
3. Dă sfaturi concrete pentru obiectivul lui ${firstName}
4. Întreabă ceva relevant pentru a continua conversația
5. Folosește un ton prietenos cu 1-2 emoji-uri
6. Acum e ${contextualGreeting} - ține cont de context
7. Personalizează totul pentru ${firstName}!`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [{ role: "user", content: naturalPrompt }],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Îmi pare rău, nu am putut procesa răspunsul."
    );
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    return "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să încerci din nou.";
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const recent = searchParams.get("recent");

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

    let query = supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    } else if (recent) {
      // Încarcă doar mesajele din ultimele 15 minute
      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
      query = query.gte("created_at", fifteenMinutesAgo.toISOString());
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Error fetching chat messages:", error);
      return NextResponse.json(
        { success: false, error: "Nu am putut încărca mesajele" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
      session_id: sessionId,
    });
  } catch (error) {
    console.error("Error in natural chat GET:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la încărcarea conversației",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, session_id, user_profile, conversation_history } =
      await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Mesajul nu poate fi gol" },
        { status: 400 }
      );
    }

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

    // Salvează mesajul utilizatorului
    const userMessageData = {
      user_id: user.id,
      session_id: session_id || `session_${Date.now()}`,
      message: message.trim(),
      is_user: true,
      created_at: new Date().toISOString(),
    };

    await supabase.from("chat_messages").insert(userMessageData);

    // Analizează alimentele din mesaj
    const detectedFoods = (await analyzeNutritionWithAI(message.trim())) || [];

    // Generează răspunsul AI
    const aiResponse = await callPerplexityAPIForNaturalChat(
      message.trim(),
      detectedFoods,
      user_profile,
      conversation_history || []
    );

    // Salvează răspunsul AI
    const aiMessageData = {
      user_id: user.id,
      session_id: session_id || `session_${Date.now()}`,
      message: aiResponse,
      is_user: false,
      created_at: new Date().toISOString(),
    };

    await supabase.from("chat_messages").insert(aiMessageData);

    // Pregătește intrările pentru jurnal dacă sunt alimente detectate
    const pendingEntries = detectedFoods.map((food: FoodEntry) => ({
      food_name: food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      meal_time: food.meal_time || "amiaza",
      date: new Date().toISOString().split("T")[0],
    }));

    return NextResponse.json({
      success: true,
      response: aiResponse,
      pending_entries: pendingEntries,
    });
  } catch (error) {
    console.error("Error in natural chat POST:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la procesarea mesajului",
      },
      { status: 500 }
    );
  }
}
