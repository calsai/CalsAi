import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json();

    console.log("Debug signup - Starting with:", { email, full_name });

    const supabase = await createSupabaseServerClient();

    // Test 1: Verifică dacă tabelul profiles există
    const { error: tableError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (tableError) {
      return NextResponse.json(
        {
          success: false,
          step: "table_check",
          error: tableError,
          message: "Tabelul profiles nu există. Aplică schema SQL în Supabase!",
        },
        { status: 500 }
      );
    }

    // Test 2: Încearcă să creezi utilizatorul
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          step: "auth_signup",
          error: authError,
          message: "Eroare la crearea utilizatorului",
        },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          success: false,
          step: "auth_result",
          message: "Nu s-a creat utilizatorul",
        },
        { status: 400 }
      );
    }

    // Test 3: Încearcă să creezi profilul
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: authData.user.id,
          full_name: full_name,
        },
      ])
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        {
          success: false,
          step: "profile_creation",
          error: profileError,
          user_created: true,
          user_id: authData.user.id,
          message: "Utilizator creat, dar profilul nu s-a putut crea",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Utilizator și profil create cu succes!",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      profile: profileData,
    });
  } catch (error) {
    console.error("Debug signup error:", error);
    return NextResponse.json(
      {
        success: false,
        step: "catch_error",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Eroare tehnică",
      },
      { status: 500 }
    );
  }
}
