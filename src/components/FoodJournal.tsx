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

interface FoodEntry {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: "dimineata" | "amiaza" | "seara";
  date: string;
  created_at: string;
}

interface FoodJournalProps {
  userProfile?: UserProfile;
}

export default function FoodJournal({ userProfile }: FoodJournalProps) {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingFood, setAddingFood] = useState({
    food_name: "",
    meal_time: "dimineata" as "dimineata" | "amiaza" | "seara",
    useAI: true,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/food-journal?date=${selectedDate}`);
        const data = await response.json();

        if (data.success) {
          setEntries(data.entries || []);
        }
      } catch (error) {
        console.error("Error loading entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [selectedDate]);

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Ești sigur că vrei să ștergi această intrare?")) return;

    try {
      const response = await fetch(`/api/food-journal`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });

      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== entryId));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const analyzeWithAI = async (foodDescription: string) => {
    try {
      const response = await fetch("/api/estimate-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodDescription,
        }),
      });

      const data = await response.json();

      if (data.success && data.nutrition) {
        return data.nutrition;
      } else {
        return estimateNutrition(foodDescription);
      }
    } catch (error) {
      console.error("Error analyzing with AI:", error);
      return estimateNutrition(foodDescription);
    }
  };

  const estimateNutrition = (foodDescription: string) => {
    // Estimări simple bazate pe cuvinte cheie
    const desc = foodDescription.toLowerCase();
    let calories = 100;
    let protein = 5;
    let carbs = 15;
    let fat = 3;

    // Pattern matching simplu pentru estimări
    if (desc.includes("ou")) {
      calories = 70;
      protein = 6;
      carbs = 1;
      fat = 5;
    } else if (desc.includes("pui") || desc.includes("piept")) {
      calories = 165;
      protein = 31;
      carbs = 0;
      fat = 3.6;
    } else if (desc.includes("pâine") || desc.includes("felie")) {
      calories = 80;
      protein = 3;
      carbs = 15;
      fat = 1;
    } else if (desc.includes("lapte")) {
      calories = 64;
      protein = 3.2;
      carbs = 4.8;
      fat = 3.6;
    }

    return { calories, protein, carbs, fat };
  };

  const addFoodEntry = async () => {
    try {
      let nutritionData = {
        calories: addingFood.calories,
        protein: addingFood.protein,
        carbs: addingFood.carbs,
        fat: addingFood.fat,
      };

      if (addingFood.useAI && addingFood.food_name.trim()) {
        nutritionData = await analyzeWithAI(addingFood.food_name);
      }

      const newEntry = {
        food_name: addingFood.food_name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        meal_time: addingFood.meal_time,
        date: selectedDate,
      };

      const response = await fetch("/api/food-journal-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          entries: [newEntry],
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh entries
        const entriesResponse = await fetch(
          `/api/food-journal?date=${selectedDate}`
        );
        const entriesData = await entriesResponse.json();
        if (entriesData.success) {
          setEntries(entriesData.entries || []);
        }

        // Reset form
        setAddingFood({
          food_name: "",
          meal_time: "dimineata",
          useAI: true,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Error adding food entry:", error);
    }
  };

  const mealTimeLabels = {
    dimineata: "🌅 Dimineața",
    amiaza: "☀️ La amiază",
    seara: "🌙 Seara",
  };

  const groupedEntries = entries.reduce((groups, entry) => {
    const mealTime = entry.meal_time;
    if (!groups[mealTime]) {
      groups[mealTime] = [];
    }
    groups[mealTime].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);

  const targetCalories = userProfile?.daily_calorie_goal || 2000;
  const calorieProgress = (totalCalories / targetCalories) * 100;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Astăzi";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Ieri";
    } else {
      return date.toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header și controale */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
              <span className="text-white text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Jurnalul alimentar
              </h2>
              <p className="text-gray-600 mt-1">
                Monitorizează-ți progresul zilnic pentru o viață mai sănătoasă
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 font-medium"
            >
              <span className="text-lg">➕</span>
              <span>Adaugă aliment</span>
            </button>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
              <label className="text-sm font-medium text-gray-700 pl-2">
                📅 Selectează data:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progres calorii și macronutrienți */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            Progresul pentru {formatDate(selectedDate)}
          </h3>
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            🏆 Obiectiv: {targetCalories} kcal/zi
          </div>
        </div>

        {/* Cards pentru macronutrienți */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🔥</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                {Math.round(calorieProgress)}%
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {Math.round(totalCalories)}
            </div>
            <div className="text-sm font-medium text-blue-600 mb-2">
              kcal consumate
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥩</span>
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">
              {Math.round(totalProtein * 10) / 10}g
            </div>
            <div className="text-sm font-medium text-red-600">Proteine</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🍞</span>
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">
              {Math.round(totalCarbs * 10) / 10}g
            </div>
            <div className="text-sm font-medium text-yellow-600">
              Carbohidrați
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥑</span>
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {Math.round(totalFat * 10) / 10}g
            </div>
            <div className="text-sm font-medium text-green-600">Grăsimi</div>
          </div>
        </div>

        {/* Bara de progres globală */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-700">Progres zilnic</span>
            <span className="text-sm font-medium text-gray-600">
              {targetCalories > totalCalories
                ? `${Math.round(targetCalories - totalCalories)} kcal rămase`
                : `${Math.round(
                    totalCalories - targetCalories
                  )} kcal peste obiectiv`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                calorieProgress > 110
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : calorieProgress > 90
                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                  : "bg-gradient-to-r from-blue-500 to-green-500"
              }`}
              style={{ width: `${Math.min(calorieProgress, 120)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Intrările pe mese */}
      {loading ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Se încarcă intrările...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center">
          <div className="text-8xl mb-6">🍽️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Nicio intrare pentru {formatDate(selectedDate)}
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Începe să îți înregistrezi mesele folosind chat-ul cu Alex!
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
            💡 Tip: Scrie mesajul tău direct în chat!
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(["dimineata", "amiaza", "seara"] as const).map((mealTime) => {
            const mealEntries = groupedEntries[mealTime] || [];
            const mealCalories = mealEntries.reduce(
              (sum, entry) => sum + entry.calories,
              0
            );

            return (
              <div
                key={mealTime}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
              >
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      {mealTimeLabels[mealTime]}
                    </h3>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border">
                      <span className="text-lg font-bold text-gray-800">
                        {Math.round(mealCalories)}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">kcal</span>
                    </div>
                  </div>
                </div>

                {mealEntries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-3">🥪</div>
                    <p className="font-medium">
                      Nicio intrare pentru această masă
                    </p>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    {mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              {entry.food_name}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                                <span>🔥</span>
                                <span className="font-medium">
                                  {Math.round(entry.calories)} kcal
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                                <span>🥩</span>
                                <span className="font-medium">
                                  P: {Math.round(entry.protein * 10) / 10}g
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                                <span>🍞</span>
                                <span className="font-medium">
                                  C: {Math.round(entry.carbs * 10) / 10}g
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                                <span>🥑</span>
                                <span className="font-medium">
                                  G: {Math.round(entry.fat * 10) / 10}g
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-70 group-hover:opacity-100 hover:scale-110"
                            title="Șterge intrarea"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal pentru adăugarea de alimente */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg mx-4 transform transition-all duration-300">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-green-50">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-2xl">🍽️</span>
                Adaugă aliment nou
              </h3>
              <p className="text-gray-600 mt-1">
                Înregistrează ceea ce ai mâncat
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Nume aliment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🥗</span>
                  Numele alimentului
                </label>
                <input
                  type="text"
                  value={addingFood.food_name}
                  onChange={(e) =>
                    setAddingFood({ ...addingFood, food_name: e.target.value })
                  }
                  placeholder="ex: 2 ouă mici, 100g piept de pui, salată cu roșii"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Timpul mesei */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>⏰</span>
                  Timpul mesei
                </label>
                <select
                  value={addingFood.meal_time}
                  onChange={(e) =>
                    setAddingFood({
                      ...addingFood,
                      meal_time: e.target.value as
                        | "dimineata"
                        | "amiaza"
                        | "seara",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800"
                >
                  <option value="dimineata">🌅 Dimineața</option>
                  <option value="amiaza">☀️ La amiază</option>
                  <option value="seara">🌙 Seara</option>
                </select>
              </div>

              {/* Toggle pentru AI vs Manual */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={addingFood.useAI}
                    onChange={(e) =>
                      setAddingFood({ ...addingFood, useAI: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded shadow-sm"
                  />
                  <label
                    htmlFor="useAI"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <span>🤖</span>
                    Estimează valorile nutriționale cu AI
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-8">
                  Recomandăm activarea pentru estimări mai precise
                </p>
              </div>

              {/* Valori manuale (dacă AI este dezactivat) */}
              {!addingFood.useAI && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    Valori nutriționale manuale
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Calorii
                      </label>
                      <input
                        type="number"
                        value={addingFood.calories}
                        onChange={(e) =>
                          setAddingFood({
                            ...addingFood,
                            calories: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Proteine (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={addingFood.protein}
                        onChange={(e) =>
                          setAddingFood({
                            ...addingFood,
                            protein: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Carbohidrați (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={addingFood.carbs}
                        onChange={(e) =>
                          setAddingFood({
                            ...addingFood,
                            carbs: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Grăsimi (g)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={addingFood.fat}
                        onChange={(e) =>
                          setAddingFood({
                            ...addingFood,
                            fat: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Butoane */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddingFood({
                    food_name: "",
                    meal_time: "dimineata",
                    useAI: true,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                  });
                }}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
              >
                Anulează
              </button>
              <button
                onClick={addFoodEntry}
                disabled={!addingFood.food_name.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>✨</span>
                Adaugă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
