import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

    const { action, entries, entryId } = await request.json();

    if (action === "confirm") {
      // Confirmă și adaugă intrările în jurnal
      if (!entries || !Array.isArray(entries)) {
        return NextResponse.json({ error: "Invalid entries" }, { status: 400 });
      }

      const entriesToInsert = entries.map((entry) => ({
        user_id: user.id,
        food_name: entry.food_name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        meal_time: entry.meal_time,
        date: entry.date,
        confirmed: true,
      }));

      const { data, error } = await supabase
        .from("food_entries")
        .insert(entriesToInsert)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        entries: data,
        message: "Alimentele au fost adăugate în jurnal!",
      });
    }

    if (action === "get") {
      // Obține intrările din jurnal pentru o zi specifică
      const { date } = await request.json();
      const targetDate = date || new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", targetDate)
        .eq("confirmed", true)
        .order("created_at", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        entries: data || [],
      });
    }

    if (action === "delete") {
      // Șterge o intrare din jurnal
      if (!entryId) {
        return NextResponse.json(
          { error: "Entry ID is required" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", entryId)
        .eq("user_id", user.id); // Securitate: doar propriile intrări

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Intrarea a fost ștearsă din jurnal",
      });
    }

    if (action === "get_history") {
      // Obține istoricul ultimelor 30 de zile
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateFrom = thirtyDaysAgo.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("confirmed", true)
        .gte("date", dateFrom)
        .order("date", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Grupează pe zile
      const groupedByDate = (data || []).reduce((acc, entry) => {
        if (!acc[entry.date]) {
          acc[entry.date] = [];
        }
        acc[entry.date].push(entry);
        return acc;
      }, {} as Record<string, any[]>);

      return NextResponse.json({
        success: true,
        history: groupedByDate,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in food journal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
