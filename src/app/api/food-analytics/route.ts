import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface FoodEntry {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: string;
  date: string;
  created_at: string;
  user_id: string;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Nu ești autentificat" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Datele de început și sfârșit sunt necesare" },
        { status: 400 }
      );
    }

    // Pentru demo, vom simula date
    const mockEntries: FoodEntry[] = [
      {
        id: "1",
        food_name: "Ouă mici cu bacon",
        calories: 320,
        protein: 25,
        carbs: 5,
        fat: 22,
        meal_time: "dimineata",
        date: "2025-08-01",
        created_at: new Date().toISOString(),
        user_id: decoded.userId,
      },
      {
        id: "2",
        food_name: "Salată de pui cu avocado",
        calories: 450,
        protein: 35,
        carbs: 15,
        fat: 28,
        meal_time: "amiaza",
        date: "2025-08-01",
        created_at: new Date().toISOString(),
        user_id: decoded.userId,
      },
      {
        id: "3",
        food_name: "Somon la grătar cu broccoli",
        calories: 380,
        protein: 40,
        carbs: 12,
        fat: 18,
        meal_time: "seara",
        date: "2025-08-01",
        created_at: new Date().toISOString(),
        user_id: decoded.userId,
      },
    ];

    const entries = mockEntries;

    if (entries.length === 0) {
      return NextResponse.json({
        success: true,
        analysis: null,
      });
    }

    // Calculează statisticile
    const totalEntries = entries.length;
    const totalCalories = entries.reduce(
      (sum: number, entry: FoodEntry) => sum + entry.calories,
      0
    );
    const totalProtein = entries.reduce(
      (sum: number, entry: FoodEntry) => sum + entry.protein,
      0
    );
    const totalCarbs = entries.reduce(
      (sum: number, entry: FoodEntry) => sum + entry.carbs,
      0
    );
    const totalFat = entries.reduce(
      (sum: number, entry: FoodEntry) => sum + entry.fat,
      0
    );

    const avgCalories = totalCalories / totalEntries;
    const avgProtein = totalProtein / totalEntries;
    const avgCarbs = totalCarbs / totalEntries;
    const avgFat = totalFat / totalEntries;

    // Calculează distribuția macronutrienților
    const totalMacros = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;
    const proteinPercent = ((totalProtein * 4) / totalMacros) * 100;
    const carbsPercent = ((totalCarbs * 4) / totalMacros) * 100;
    const fatPercent = ((totalFat * 9) / totalMacros) * 100;

    // Găsește masa preferată
    const mealTimes = entries.reduce(
      (acc: Record<string, number>, entry: FoodEntry) => {
        acc[entry.meal_time] = (acc[entry.meal_time] || 0) + 1;
        return acc;
      },
      {}
    );

    const favoriteTime = Object.keys(mealTimes).reduce((a, b) =>
      mealTimes[a] > mealTimes[b] ? a : b
    );

    // Top alimente
    const foodCounts = entries.reduce(
      (
        acc: Record<
          string,
          { name: string; count: number; totalCalories: number }
        >,
        entry: FoodEntry
      ) => {
        const foodName = entry.food_name.toLowerCase();
        if (!acc[foodName]) {
          acc[foodName] = {
            name: entry.food_name,
            count: 0,
            totalCalories: 0,
          };
        }
        acc[foodName].count++;
        acc[foodName].totalCalories += entry.calories;
        return acc;
      },
      {}
    );

    const topFoods = Object.values(foodCounts)
      .map((food: { name: string; count: number; totalCalories: number }) => ({
        name: food.name,
        count: food.count,
        calories: Math.round(food.totalCalories / food.count),
      }))
      .sort((a, b) => b.count - a.count);

    // Analiză dietă
    let dietAnalysis = "";

    if (proteinPercent > 30) {
      dietAnalysis =
        "Dieta ta este bogată în proteine, ceea ce este excelent pentru menținerea masei musculare și sațietate. ";
    } else if (proteinPercent < 15) {
      dietAnalysis =
        "Aportul tău de proteine este scăzut. Încearcă să incluzi mai multe surse de proteine în dietă. ";
    } else {
      dietAnalysis = "Aportul tău de proteine este în limitele normale. ";
    }

    if (carbsPercent > 60) {
      dietAnalysis +=
        "Consumul de carbohidrați este ridicat - asigură-te că provind din surse complexe. ";
    } else if (carbsPercent < 30) {
      dietAnalysis +=
        "Urmezi o dietă low-carb, ceea ce poate fi benefic pentru pierderea în greutate. ";
    }

    if (fatPercent > 40) {
      dietAnalysis +=
        "Aportul de grăsimi este ridicat - încearcă să te concentrezi pe grăsimi sănătoase. ";
    }

    dietAnalysis += `Analizând datele tale recente, ai înregistrat ${totalEntries} mese cu o medie de ${Math.round(
      avgCalories
    )} calorii pe intrare. Preferințele tale alimentare arată o înclinație către alimente bogate în proteine, ceea ce este benefic pentru obiectivele de fitness.`;

    // Pattern săptămânal (simplificat)
    const weeklyPattern = entries.reduce(
      (acc: Record<string, number>, entry: FoodEntry) => {
        const date = entry.date;
        acc[date] = (acc[date] || 0) + entry.calories;
        return acc;
      },
      {}
    );

    const analysis = {
      totalEntries,
      avgCalories: Math.round(avgCalories),
      avgProtein: Math.round(avgProtein * 10) / 10,
      avgCarbs: Math.round(avgCarbs * 10) / 10,
      avgFat: Math.round(avgFat * 10) / 10,
      favoriteTime,
      topFoods,
      macroDistribution: {
        protein: Math.round(proteinPercent),
        carbs: Math.round(carbsPercent),
        fat: Math.round(fatPercent),
      },
      dietAnalysis,
      weeklyPattern,
    };

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Eroare la încărcarea analizei:", error);
    return NextResponse.json(
      { success: false, error: "Eroare la încărcarea analizei" },
      { status: 500 }
    );
  }
}
