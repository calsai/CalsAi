import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Test conexiune la baza de date
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: "Eroare la conectarea la baza de date",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conexiunea la Supabase funcționează!",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
}
