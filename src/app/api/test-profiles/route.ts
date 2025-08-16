import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Test específic pentru tabelul profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, full_name")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          message:
            "Tabelul profiles nu există sau nu ai permisiuni. Aplică schema SQL în Supabase!",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tabelul profiles există și funcționează!",
      data: data,
      count: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Eroare necunoscută",
        message: "Eroare la testarea tabelului profiles",
      },
      { status: 500 }
    );
  }
}
