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
        model: "sonar",
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

  let naturalPrompt = `Ești Alex, antrenorul personal și nutriționistul lui ${firstName}. Aveți o relație de încredere construită în timp. Nu spui că ești un AI - vorbești ca un ADEVĂRAT ANTRENOR care își cunoaște clientul.

MESAJUL LUI ${firstName.toUpperCase()}: "${message}"

PERSONALITATEA TA ALEX:
� Profesionist dar prietenos - vorbești direct și clar
💪 Motivational și pozitiv - înțelegi provocările lui ${firstName}
🧠 Expert cu experiență reală - dai sfaturi testate și practice
❤️ Îți pasă cu adevărat de progresul și sănătatea lui ${firstName}

CONTEXTUL VOSTRU:
• Lucrați împreună la obiectivele lui ${firstName}
• Ai înțelegere completă despre situația și preferințele lui
• Răspunzi ca și cum ați fi discutat face-to-face de multe ori
• Nu repeți informații de bază - dezvolți planurile existente
• Faci referiri la progresul și conversațiile anterioare când e relevant`;

  if (detectedFoods.length > 0) {
    naturalPrompt += `\n\n🍽️ ${firstName.toUpperCase()} A MÂNCAT ASTĂZI:\n`;
    naturalPrompt += detectedFoods
      .map(
        (f) =>
          `✓ ${f.name} → ${f.calories} cal, ${f.protein}g proteine, ${f.carbs}g carbo, ${f.fat}g grăsimi`
      )
      .join("\n");
    naturalPrompt += `\n\nANALIZEAZĂ ACEST MEAL ȘI DĂ FEEDBACK DETALIAT!`;
  }

  if (userProfile) {
    naturalPrompt += `\n\n📋 PROFILUL CLIENTULUI ${firstName.toUpperCase()}:
🎯 Obiectiv principal: ${
      userProfile.goal === "lose"
        ? "SLĂBIRE - deficit caloric controlat"
        : userProfile.goal === "gain"
        ? "CREȘTERE ÎN MASĂ - surplus caloric + antrenament"
        : "MENȚINERE - recompoziție corporală"
    }
📊 Target zilnic: ${
      userProfile.daily_calorie_goal || "NECALCULAT - PRIORITATE!"
    } calorii
👤 Stats: ${userProfile.age || "?"}ani, ${userProfile.weight || "?"}kg, ${
      userProfile.height || "?"
    }cm
🏃 Activitate: ${userProfile.activity_level || "nespecificată"}

${
  !userProfile.daily_calorie_goal
    ? "⚠️ LIPSEȘTE CALCULUL CALORIC - trebuie stabilit urgent!"
    : ""
}`;
  }

  if (conversationHistory.length > 0) {
    naturalPrompt += `\n\n� CONTEXT DIN CONVERSAȚIILE VOASTRE RECENTE:`;
    naturalPrompt += conversationHistory
      .slice(-4)
      .map(
        (h) =>
          `\n• ${
            h.role === "user" ? `${firstName}` : "Tu (Alex)"
          }: ${h.content.substring(0, 150)}...`
      )
      .join("");
    naturalPrompt += `\n\n↗️ CONTINUĂ CONVERSAȚIA NATURAL ȘI REFERĂ-TE LA DISCUȚIILE ANTERIOARE!`;
  }

  naturalPrompt += `\n\n🎯 INSTRUCȚIUNI PENTRU RĂSPUNSUL TĂU ALEX:

STILUL CONVERSAȚIEI:
• Vorbește natural, ca și cum v-ați întâlni în sala de sport
• Fii specific și personal - nu da sfaturi generice
• Folosește experiența voastră comună și progresul lui ${firstName}
• Răspunsuri de 300-600 de cuvinte pentru consultanță completă
• Emojis pentru structură și energie pozitivă

CONȚINUTUL RĂSPUNSULUI:
� Analizează situația actuală în detaliu
💡 Sfaturi concrete și actionabile pentru următoarele 24-48h
🎯 Planuri specifice adaptate la ${firstName}
❓ Întrebări pentru a continua progresul
🔥 Motivație și încurajare personalizată

NEVER:
❌ Nu spui că ești un AI sau sistem automatizat
❌ Nu repeți informații de bază pe care le știți deja
❌ Nu dai sfaturi generice - totul specific pentru ${firstName}
❌ Nu menționezi că "nu poți" - găsești soluții creative

CONTEXTUL ZILEI: E ${contextualGreeting} - adaptează sfaturile la momentul zilei

RĂSPUNDE NATURAL ÎN ROMÂNĂ, ca antrenorul personal care ești pentru ${firstName}!`;

  try {
    console.log("🔗 Sending request to Perplexity...");
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [{ role: "user", content: naturalPrompt }],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    console.log("📡 Perplexity response status:", response.status);
    const data = await response.json();
    console.log("📋 Perplexity data:", data);

    const aiResponse =
      data.choices?.[0]?.message?.content ||
      "Îmi pare rău, nu am putut procesa răspunsul.";

    console.log("✅ Final AI response:", aiResponse);
    return aiResponse;
  } catch (error) {
    console.error("❌ Error calling Perplexity API:", error);
    return "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să încerci din nou.";
  }
}

export async function GET(request: NextRequest) {
  try {
    // Pentru acum returnăm o listă goală până când tabelele sunt create
    return NextResponse.json({
      success: true,
      messages: [],
      session_id: null,
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

    // TEMPORAR: Nu salvăm mesajul utilizatorului până când tabelele sunt create
    // const userMessageData = {
    //   user_id: user.id,
    //   session_id: session_id || `session_${Date.now()}`,
    //   message: message.trim(),
    //   is_user: true,
    //   created_at: new Date().toISOString()
    // };
    // await supabase.from('chat_messages').insert(userMessageData);

    // Analizează alimentele din mesaj
    console.log("📝 Analyzing message:", message.trim());
    const detectedFoods = (await analyzeNutritionWithAI(message.trim())) || [];
    console.log("🍽️ Detected foods:", detectedFoods);

    // Generează răspunsul AI
    console.log("🤖 Calling Perplexity AI...");
    const aiResponse = await callPerplexityAPIForNaturalChat(
      message.trim(),
      detectedFoods,
      user_profile,
      conversation_history || []
    );
    console.log("💬 AI Response:", aiResponse);

    // TEMPORAR: Nu salvăm în chat_messages până când tabelele sunt create
    // const aiMessageData = {
    //   user_id: user.id,
    //   session_id: session_id || `session_${Date.now()}`,
    //   message: aiResponse,
    //   is_user: false,
    //   created_at: new Date().toISOString(),
    // };
    // await supabase.from("chat_messages").insert(aiMessageData);

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
