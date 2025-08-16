import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
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

    // Încarcă sesiunile de chat pentru utilizator (ultimele 10)
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("id, created_at, title, message_count")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching chat sessions:", error);
      return NextResponse.json(
        { success: false, error: "Nu am putut încărca sesiunile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error) {
    console.error("Error in chat sessions GET:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la încărcarea sesiunilor",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID este necesar" },
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

    // Creează sau actualizează sesiunea
    const { data, error } = await supabase
      .from("chat_sessions")
      .upsert({
        id: session_id,
        user_id: user.id,
        title: title || "Conversație nouă",
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error creating/updating chat session:", error);
      return NextResponse.json(
        { success: false, error: "Nu am putut salva sesiunea" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data?.[0],
    });
  } catch (error) {
    console.error("Error in chat sessions POST:", error);
    return NextResponse.json(
      {
        success: false,
        error: "A apărut o eroare la salvarea sesiunii",
      },
      { status: 500 }
    );
  }
}
