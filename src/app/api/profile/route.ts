import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Calcularea caloriilor zilnice recomandate
function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  activityLevel: string,
  goal: string
): number {
  // Formula Harris-Benedict pentru metabolismul bazal
  // Pentru simplificare, calculez pentru bărbați (pentru femei se scade ~200-300 cal)
  const bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;

  // Factorul de activitate
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const activity =
    activityFactors[activityLevel as keyof typeof activityFactors] || 1.2;
  const maintenanceCalories = bmr * activity;

  // Ajustarea pentru obiectiv
  switch (goal) {
    case "lose":
      return Math.round(maintenanceCalories - 500); // Deficit de 500 cal
    case "gain":
      return Math.round(maintenanceCalories + 300); // Surplus de 300 cal
    default:
      return Math.round(maintenanceCalories);
  }
}

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

    // Obține profilul utilizatorului
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: profile || null,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { full_name, age, weight, height, activity_level, goal } =
      await request.json();

    // Calculează caloriile zilnice dacă avem datele necesare
    let daily_calorie_goal = null;
    if (weight && height && age && activity_level && goal) {
      daily_calorie_goal = calculateDailyCalories(
        weight,
        height,
        age,
        activity_level,
        goal
      );
    }

    // Încearcă să actualizeze profilul existent
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let result;

    if (existingProfile) {
      // Actualizează profilul existent
      result = await supabase
        .from("profiles")
        .update({
          full_name,
          age,
          weight,
          height,
          activity_level,
          goal,
          daily_calorie_goal,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      // Creează un profil nou
      result = await supabase
        .from("profiles")
        .insert([
          {
            user_id: user.id,
            full_name,
            age,
            weight,
            height,
            activity_level,
            goal,
            daily_calorie_goal,
          },
        ])
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: result.data,
      message: "Profil salvat cu succes!",
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
