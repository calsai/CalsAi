import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

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

    // Dacă nu e specificată data, folosește data de azi
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Încarcă intrările pentru data specificată
    const { data: entries, error } = await supabase
      .from("food_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", targetDate)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching food entries:", error);
      return NextResponse.json(
        { success: false, error: "Nu am putut încărca intrările" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      entries: entries || [],
    });
  } catch (error) {
    console.error("Error in food journal GET:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la încărcarea intrărilor",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { entryId } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: "ID-ul intrării este necesar" },
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

    // Șterge intrarea (RLS se va asigura că utilizatorul poate șterge doar propriile intrări)
    const { error } = await supabase
      .from("food_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting food entry:", error);
      return NextResponse.json(
        { success: false, error: "Nu am putut șterge intrarea" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Intrarea a fost ștearsă cu succes",
    });
  } catch (error) {
    console.error("Error in food journal DELETE:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la ștergerea intrării",
      },
      { status: 500 }
    );
  }
}
