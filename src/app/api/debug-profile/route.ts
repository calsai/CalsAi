import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

    console.log("Checking profile for user:", user.id);

    // Încearcă să obții profilul fără daily_calorie_goal mai întâi
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, age, weight, height, gender, activity_level, goal, created_at, updated_at"
      )
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Profile query error:", error);
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: profile || null,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
      },
      message: profile ? "Profile found" : "No profile found",
    });
  } catch (error) {
    console.error("Error in debug profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
