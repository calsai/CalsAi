import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Test 1: Verifică tabelul profiles
    const { error: profilesError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    // Test 2: Verifică tabelul food_entries
    const { error: foodError } = await supabase
      .from("food_entries")
      .select("count")
      .limit(1);

    // Test 3: Verifică tabelul chat_messages
    const { error: chatError } = await supabase
      .from("chat_messages")
      .select("count")
      .limit(1);

    // Test 4: Verifică tabelul recipes
    const { error: recipesError } = await supabase
      .from("recipes")
      .select("count")
      .limit(1);

    const results = {
      profiles: profilesError ? `❌ ${profilesError.message}` : "✅ Există",
      food_entries: foodError ? `❌ ${foodError.message}` : "✅ Există",
      chat_messages: chatError ? `❌ ${chatError.message}` : "✅ Există",
      recipes: recipesError ? `❌ ${recipesError.message}` : "✅ Există",
    };

    const allTablesExist =
      !profilesError && !foodError && !chatError && !recipesError;

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist
        ? "🎉 Toate tabelele există! Schema a fost aplicată cu succes!"
        : "❌ Unele tabele lipsesc. Trebuie să aplici schema SQL în Supabase.",
      tables: results,
      instruction: allTablesExist
        ? "Poți să încerci să te înregistrezi acum!"
        : "Mergi pe supabase.com → SQL Editor → rulează supabase-schema.sql",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Eroare la verificarea tabelelor",
      },
      { status: 500 }
    );
  }
}
