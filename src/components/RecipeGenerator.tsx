"use client";

import { useState } from "react";

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

interface Recipe {
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

interface RecipeGeneratorProps {
  userProfile?: UserProfile;
}

export default function RecipeGenerator({ userProfile }: RecipeGeneratorProps) {
  const [preferences, setPreferences] = useState("");
  const [mealType, setMealType] = useState("orice");
  const [timeLimit, setTimeLimit] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");

  const generateRecipe = async () => {
    if (!preferences.trim()) {
      setError("Te rog să descrii ce fel de rețetă vrei");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const response = await fetch("/api/recipe-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: preferences.trim(),
          meal_type: mealType,
          time_limit: timeLimit ? parseInt(timeLimit) : null,
          available_ingredients: ingredients.trim(),
          user_profile: userProfile,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipe(data.recipe);
      } else {
        setError(data.error || "Nu am putut genera rețeta");
      }
    } catch {
      setError("A apărut o eroare. Te rog să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  const mealTypes = [
    { value: "orice", label: "Orice fel de masă" },
    { value: "mic_dejun", label: "Mic dejun" },
    { value: "pranz", label: "Prânz" },
    { value: "cina", label: "Cină" },
    { value: "gustare", label: "Gustare" },
  ];

  const examplePrompts = [
    "O salată sănătoasă cu pui și avocado",
    "Ceva rapid pentru mic dejun cu ouă",
    "O supă caldă și hrănitoare pentru seara",
    "Un smoothie proteic pentru după antrenament",
    "O masă vegetariană bogată în proteine",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
            <span className="text-white text-2xl">👨‍🍳</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generator de rețete
            </h2>
            <p className="text-gray-600 mt-1">
              Descrie ce vrei să gătești și îți voi genera o rețetă
              personalizată
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>💭</span>
              Ce ai vrea să gătești? *
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="De exemplu: ceva sănătos cu pui, o supă de legume, un desert fără zahăr..."
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🍽️</span>
                Tipul mesei
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800"
              >
                {mealTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>⏱️</span>
                Timp maxim (minute)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="ex: 30"
                min="5"
                max="240"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🛒</span>
              Ingrediente disponibile (opțional)
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="ex: pui, broccoli, orez, roșii..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={generateRecipe}
            disabled={loading || !preferences.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Generez rețeta...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">👨‍🍳</span>
                <span>Generează rețeta</span>
              </div>
            )}
          </button>
        </div>

        {/* Example prompts */}
        {!recipe && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>💡</span>
              Idei de rețete populare:
            </p>
            <div className="flex flex-wrap gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setPreferences(prompt)}
                  className="text-sm bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-4 py-2 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-200 text-purple-700 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Result */}
      {recipe && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Recipe Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">{recipe.name}</h3>
                <p className="text-purple-100 text-lg">{recipe.description}</p>
              </div>
              <div className="text-6xl ml-4">👨‍🍳</div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <span className="text-xl">⏱️</span>
                <span>Prep: {recipe.prep_time} min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <span className="text-xl">🔥</span>
                <span>Gătire: {recipe.cook_time} min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <span className="text-xl">👥</span>
                <span>{recipe.servings} porții</span>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="p-8 bg-gradient-to-r from-gray-50 to-purple-50 border-b">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-2xl">📊</span>
              Informații nutriționale (per porție):
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-4 text-center shadow-md border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round(recipe.calories_per_serving)}
                </div>
                <div className="text-sm font-medium text-blue-700">kcal</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {Math.round(recipe.protein_per_serving * 10) / 10}g
                </div>
                <div className="text-sm font-medium text-red-700">Proteine</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {Math.round(recipe.carbs_per_serving * 10) / 10}g
                </div>
                <div className="text-sm font-medium text-yellow-700">
                  Carbohidrați
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round(recipe.fat_per_serving * 10) / 10}g
                </div>
                <div className="text-sm font-medium text-green-700">
                  Grăsimi
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-3">
                  <span className="text-2xl">🛒</span>
                  Ingrediente:
                </h4>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-200"
                    >
                      <span className="text-blue-500 text-lg">•</span>
                      <span className="text-gray-700 font-medium">
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  Instrucțiuni:
                </h4>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 bg-white rounded-lg p-3 border border-purple-200"
                    >
                      <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  Tags:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-xl border border-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setRecipe(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Generează altă rețetă
              </button>
              <button
                onClick={() => {
                  const text = `${recipe.name}\n\n${
                    recipe.description
                  }\n\nIngrediente:\n${recipe.ingredients.join(
                    "\n"
                  )}\n\nInstrucțiuni:\n${recipe.instructions
                    .map((inst, i) => `${i + 1}. ${inst}`)
                    .join("\n")}`;
                  navigator.clipboard.writeText(text);
                  alert("Rețeta a fost copiată în clipboard!");
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>📋</span>
                Copiază rețeta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
