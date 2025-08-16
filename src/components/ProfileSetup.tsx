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

interface ProfileSetupProps {
  userProfile?: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onClose?: () => void;
  embedded?: boolean;
}

export default function ProfileSetup({
  userProfile,
  onProfileUpdate,
  onClose,
  embedded = false,
}: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    weight: "",
    height: "",
    gender: "male" as "male" | "female",
    activity_level: "moderate" as
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active",
    goal: "maintain" as "lose" | "maintain" | "gain",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || "",
        age: userProfile.age?.toString() || "",
        weight: userProfile.weight?.toString() || "",
        height: userProfile.height?.toString() || "",
        gender: userProfile.gender || "male",
        activity_level: userProfile.activity_level || "moderate",
        goal: userProfile.goal || "maintain",
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseInt(formData.height),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onProfileUpdate(data.profile);
        if (onClose) onClose();
      } else {
        setError(data.error || "A apărut o eroare");
      }
    } catch {
      setError("A apărut o eroare la salvarea profilului");
    } finally {
      setLoading(false);
    }
  };

  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentar",
      description: "Puțină sau deloc activitate fizică",
    },
    {
      value: "light",
      label: "Ușor activ",
      description: "Exerciții ușoare 1-3 zile/săptămână",
    },
    {
      value: "moderate",
      label: "Moderat activ",
      description: "Exerciții moderate 3-5 zile/săptămână",
    },
    {
      value: "active",
      label: "Activ",
      description: "Exerciții intense 6-7 zile/săptămână",
    },
    {
      value: "very_active",
      label: "Foarte activ",
      description: "Exerciții foarte intense, 2x pe zi",
    },
  ];

  const goals = [
    {
      value: "lose",
      label: "Pierdere în greutate",
      description: "Vreau să slăbesc",
    },
    {
      value: "maintain",
      label: "Menținere",
      description: "Vreau să îmi mențin greutatea",
    },
    {
      value: "gain",
      label: "Creștere în greutate",
      description: "Vreau să mă îngraș/să câștig masă musculară",
    },
  ];

  const content = (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 rounded-2xl">
            <span className="text-white text-3xl">👤</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          {userProfile
            ? "Actualizează-ți profilul"
            : "Să te cunoaștem mai bine"}
        </h2>
        <p className="text-gray-600 text-lg">
          Aceste informații ne ajută să îți calculăm necesarul caloric și să îți
          oferim recomandări personalizate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>✨</span>
            Numele complet
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
            placeholder="Alex Popescu"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>🎂</span>
              Vârsta (ani)
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="25"
              min="13"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>⚖️</span>
              Greutatea (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="70"
              min="30"
              max="300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>📏</span>
              Înălțimea (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="175"
              min="120"
              max="250"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>🚻</span>
            Sexul
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                className="sr-only"
              />
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === "male"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block">👨</span>
                  <span className="font-medium">Masculin</span>
                </div>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                className="sr-only"
              />
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === "female"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block">👩</span>
                  <span className="font-medium">Feminin</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>🏃‍♂️</span>
            Nivelul de activitate
          </label>
          <div className="space-y-3">
            {activityLevels.map((level) => (
              <label key={level.value} className="cursor-pointer block">
                <input
                  type="radio"
                  value={level.value}
                  checked={formData.activity_level === level.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activity_level: e.target
                        .value as typeof formData.activity_level,
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.activity_level === level.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {level.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {level.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>🎯</span>
            Obiectivul tău
          </label>
          <div className="space-y-3">
            {goals.map((goal) => (
              <label key={goal.value} className="cursor-pointer block">
                <input
                  type="radio"
                  value={goal.value}
                  checked={formData.goal === goal.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal: e.target.value as typeof formData.goal,
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.goal === goal.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {goal.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {goal.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
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
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Se salvează...</span>
            </div>
          ) : userProfile ? (
            <div className="flex items-center justify-center gap-2">
              <span>✅</span>
              <span>Actualizează profilul</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>💾</span>
              <span>Salvează profilul</span>
            </div>
          )}
        </button>

        {onClose && !embedded && (
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-all duration-200"
          >
            Anulează
          </button>
        )}
      </form>
    </div>
  );

  if (embedded) {
    return <div className="max-w-4xl mx-auto">{content}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">{content}</div>
      </div>
    </div>
  );
}
