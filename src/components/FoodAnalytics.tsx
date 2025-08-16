"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  full_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: "male" | "female";
  activity_level?:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active";
  goal?: "lose" | "maintain" | "gain";
  daily_calorie_goal?: number;
}

interface FoodAnalyticsProps {
  userProfile?: UserProfile;
}

interface FoodAnalysis {
  totalEntries: number;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  favoriteTime: string;
  topFoods: { name: string; count: number; calories: number }[];
  macroDistribution: { protein: number; carbs: number; fat: number };
  dietAnalysis: string;
  weeklyPattern: { [key: string]: number };
}

export default function FoodAnalytics({}: FoodAnalyticsProps) {
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(
          Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];

        const response = await fetch(
          `/api/food-analytics?start=${startDate}&end=${endDate}`
        );
        const data = await response.json();

        if (data.success) {
          setAnalysis(data.analysis);
        }
      } catch (error) {
        console.error("Error loading analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  const getDietType = (macros: {
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    if (macros.carbs > 50) return "Diet bogat în carbohidrați";
    if (macros.protein > 30) return "Diet bogat în proteine";
    if (macros.fat > 35) return "Diet bogat în grăsimi";
    if (macros.carbs < 30) return "Diet low-carb";
    return "Diet echilibrat";
  };

  const getMealTimeLabel = (time: string) => {
    switch (time) {
      case "dimineata":
        return "Dimineața";
      case "amiaza":
        return "La amiază";
      case "seara":
        return "Seara";
      default:
        return time;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Se analizează datele...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center">
          <div className="text-8xl mb-6">📊</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Nu există date suficiente
          </h3>
          <p className="text-gray-600 text-lg">
            Adaugă mai multe alimente în jurnal pentru a vedea analize detaliate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header și controale */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
              <span className="text-white text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Analiza obiceiurilor alimentare
              </h2>
              <p className="text-gray-600 mt-1">
                Descoperă-ți preferințele și obiceiurile de alimentație
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
            <label className="text-sm font-medium text-gray-700 pl-2">
              📅 Perioada:
            </label>
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "7" | "30" | "90")
              }
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="7">Ultima săptămână</option>
              <option value="30">Ultima lună</option>
              <option value="90">Ultimele 3 luni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistici generale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {analysis.totalEntries}
          </div>
          <div className="text-sm font-medium text-blue-600">
            Înregistrări totale
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-1">
            {Math.round(analysis.avgCalories)}
          </div>
          <div className="text-sm font-medium text-green-600">
            Calorii medii/zi
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-lg font-bold text-purple-700 mb-1">
            {getMealTimeLabel(analysis.favoriteTime)}
          </div>
          <div className="text-sm font-medium text-purple-600">
            Masa preferată
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🥗</span>
          </div>
          <div className="text-lg font-bold text-yellow-700 mb-1">
            {getDietType(analysis.macroDistribution)}
          </div>
          <div className="text-sm font-medium text-yellow-600">
            Tipul de dietă
          </div>
        </div>
      </div>

      {/* Distribuția macronutrienților */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-2xl">🥗</span>
          Distribuția macronutrienților
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-700 mb-2">
                {Math.round(analysis.macroDistribution.protein)}%
              </div>
              <div className="text-red-600 font-medium mb-3">Proteine</div>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.macroDistribution.protein}%` }}
                />
              </div>
              <div className="text-sm text-red-600 mt-2">
                {Math.round(analysis.avgProtein)}g în medie
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-700 mb-2">
                {Math.round(analysis.macroDistribution.carbs)}%
              </div>
              <div className="text-yellow-600 font-medium mb-3">
                Carbohidrați
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.macroDistribution.carbs}%` }}
                />
              </div>
              <div className="text-sm text-yellow-600 mt-2">
                {Math.round(analysis.avgCarbs)}g în medie
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">
                {Math.round(analysis.macroDistribution.fat)}%
              </div>
              <div className="text-green-600 font-medium mb-3">Grăsimi</div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.macroDistribution.fat}%` }}
                />
              </div>
              <div className="text-sm text-green-600 mt-2">
                {Math.round(analysis.avgFat)}g în medie
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alimentele preferate */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          Alimentele tale preferate
        </h3>

        <div className="space-y-4">
          {analysis.topFoods.slice(0, 10).map((food, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{food.name}</h4>
                    <p className="text-sm text-gray-600">
                      Consumat de {food.count} ori
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-700">
                    {Math.round(food.calories)} kcal
                  </div>
                  <div className="text-sm text-gray-600">în medie</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analiza comportamentului */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          Analiza comportamentului alimentar
        </h3>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-purple-200">
          <p className="text-gray-700 leading-relaxed text-lg">
            {analysis.dietAnalysis}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <span>✅</span>
              Puncte forte
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Consistență în înregistrarea meselor</li>
              <li>• Varietate în alegerea alimentelor</li>
              {analysis.macroDistribution.protein > 20 && (
                <li>• Aport adecvat de proteine</li>
              )}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <span>🎯</span>
              Recomandări
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              {analysis.macroDistribution.protein < 20 && (
                <li>• Crește aportul de proteine</li>
              )}
              {analysis.macroDistribution.fat > 40 && (
                <li>• Reduce grăsimile saturate</li>
              )}
              <li>• Diversifică sursele de nutrienți</li>
              <li>• Menține regularitatea meselor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
