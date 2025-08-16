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
            content: "Ești un expert nutriționist care analizează mesajele pentru extragerea precisă a informațiilor nutriționale. Răspunzi DOAR cu JSON valid."
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

// AI prompt mult mai natural și uman
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

  const naturalPrompt = `
Ești Alex, un nutriționist personal foarte empatic, prietenos și profesionist care lucrează cu ${firstName}. 

PERSONALITATEA TA:
- Vorbești ca un prieten apropiat, dar cu expertiză profesională
- Ești entuziast și încurajator în fiecare răspuns
- Folosești emoji-uri cu măsură pentru a fi mai prietenos
- Dai sfaturi practice și implementabile
- Ești atent la contextul orei zilei (acum e ${contextualGreeting})
- Nu repeți informații pe care le-ai dat deja în conversație

MESAJUL DE ACUM: "${message}"

${detectedFoods.length > 0 
  ? `
🍽️ AM DETECTAT ACESTE ALIMENTE:
${detectedFoods.map((f) => `- ${f.name} (${f.calories} calorii, ${f.protein}g proteine, ${f.carbs}g carbo, ${f.fat}g grăsimi)`).join("\n")}

CONFIRMĂ-LE și adaugă-le în jurnalul alimentar automat!
` 
  : ""
}

${userProfile 
  ? `
PROFILUL LUI ${firstName.toUpperCase()}:
- 🎯 Obiectiv: ${userProfile.goal === "lose" ? "Slăbire" : userProfile.goal === "gain" ? "Îngrășare" : "Menținere"}
- 📊 Calorii zilnice: ${userProfile.daily_calorie_goal || "necalculate"} cal
- 👤 ${userProfile.age || "?"}ani, ${userProfile.weight || "?"}kg, ${userProfile.height || "?"}cm
- 🏃 Nivel activitate: ${userProfile.activity_level || "nedefinit"}
` 
  : ""
}

${conversationHistory.length > 0 
  ? `
CONTEXTE DIN CONVERSAȚIA ANTERIOARĂ:
${conversationHistory.slice(-4).map(h => `${h.role === "user" ? firstName : "Alex"}: ${h.content.substring(0, 100)}...`).join("\n")}
` 
  : ""
}

INSTRUCȚIUNI PENTRU RĂSPUNS:
1. Răspunde în ROMÂNA cu 2-4 propoziții, nu scrie eseuri lungi
2. Dacă ai detectat alimente, confirmă-le entuziast și explică valoarea lor nutrițională
3. Dă sfaturi concrete pentru obiectivul lui ${firstName}
4. Întreabă ceva relevant pentru a continua conversația
5. Folosește un ton prietenos și încurajator cu 1-2 emoji-uri
6. Dacă e dimineața, concentrează-te pe energia pentru ziua care începe
7. Dacă e seara, concentrează-te pe recuperarea și somnul
8. Dacă întreabă despre ceva, răspunde direct și apoi dă o sugestie practică

ATENȚIE: Nu da răspunsuri generice! Personalizează totul pentru ${firstName} și contextul specific!`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
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
    return data.choices?.[0]?.message?.content || "Îmi pare rău, nu am putut procesa răspunsul.";
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    return "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să încerci din nou.";
  }
}

PERSONALITATEA TA:
- Vorbești natural, ca și cum ați fi prieteni
- Ești empatic și înțelegător cu starea lui de spirit
- Dai sfaturi practice, nu lecții
- Folosești expresii românești naturale
- Nu suni robotic sau formal
- Îl motivezi pozitiv, fără să fii judecător
- Adresezi și starea emoțională legată de mâncare

SARCINA TA:
1. Răspunde empatic la cum se simte
2. Confirmă alimentele detectate NATURAL (nu ca o listă robotică)
3. Dă sfaturi nutriționale practice
4. Întreabă cum se simte alimentar/emoțional
5. Sugerează îmbunătățiri blânde

STIL DE RĂSPUNS:
- Răspunde ca un prieten apropiat
- Maxim 80-100 cuvinte
- Fără formatări artificiale sau bullet points
- Natural și conversațional

EXEMPLE DE TON:
"Văd că ai mâncat... Cum te simți după? Îți recomand să..." 
"Mă bucur că ai ales... Te-a săturat? Poate data viitoare..."
"Înțeleg că îți e greu cu... Hai să găsim împreună o soluție..."
`;

  try {
    // Folosește fetch direct pentru Perplexity API
    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
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
                "Ești Alex, un nutriționist prietenos și empatic care vorbește natural cu utilizatorii.",
            },
            {
              role: "user",
              content: naturalPrompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 150,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Perplexity API error:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (
      data.choices[0]?.message?.content ||
      "Îmi pare rău, nu am putut răspunde acum. Cum te simți?"
    );
  } catch (error) {
    console.error("Perplexity API error:", error);

    if (detectedFoods.length > 0) {
      return `Văd că ai mâncat ${detectedFoods
        .map((f) => f.name)
        .join(", ")}. Cum te simți după masă? Ai vrea să vorbim despre asta?`;
    }

    return "Îmi pare rău, am o problemă tehnică. Dar spune-mi, cum te simți astăzi din punct de vedere alimentar?";
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const supabase = await createSupabaseServerClient();

    // Verifică autentificarea
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Obține profilul utilizatorului
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Detectează alimentele cu AI
    const detectedFoods = await analyzeNutritionWithAI(message);

    // Salvează mesajul utilizatorului
    await supabase.from("chat_messages").insert([
      {
        user_id: user.id,
        message: message,
        is_user: true,
        message_type: detectedFoods && detectedFoods.length > 0 ? "nutrition" : "general",
      },
    ]);

    // Pregătește intrările pentru jurnal doar dacă AI-ul a detectat alimente
    let pendingEntries: Array<{
      user_id: string;
      food_name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      meal_time: string;
      date: string;
      confirmed: boolean;
    }> = [];
    
    if (detectedFoods && detectedFoods.length > 0) {
      pendingEntries = detectedFoods.map((food: FoodEntry) => ({
        user_id: user.id,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        meal_time: food.meal_time || getCurrentMealTime(),
        date: new Date().toISOString().split("T")[0],
        confirmed: true, // Salvează automat
      }));

      // Salvează automat alimentele detectate în jurnal
      await supabase.from("food_entries").insert(pendingEntries);
    }

    // Obține răspunsul natural de la Perplexity AI
    const aiResponse = await callPerplexityAPIForNaturalChat(
      message,
      detectedFoods || [],
      profile
    );

    // Salvează răspunsul AI
    await supabase.from("chat_messages").insert([
      {
        user_id: user.id,
        message: aiResponse,
        is_user: false,
        message_type: "nutrition",
      },
    ]);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      savedEntries: pendingEntries,
      foodsDetected: detectedFoods.length > 0,
    });
  } catch (error) {
    console.error("Error in natural chat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}

// GET - încarcă istoricul de chat
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Verifică autentificarea
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Încarcă mesajele din chat pentru utilizatorul curent
    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(100); // Limitează la ultimele 100 de mesaje

    if (messagesError) {
      console.error("Error loading chat messages:", messagesError);
      return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });

  } catch (error) {
    console.error("Error in GET natural chat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
