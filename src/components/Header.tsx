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

type TabType = "chat" | "jurnal" | "retete" | "analiza" | "profil";

interface HeaderProps {
  activeTab: TabType;
  userProfile?: UserProfile | null;
}

export default function Header({ activeTab, userProfile }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles = {
    chat: "Chat cu Alex AI",
    jurnal: "Jurnalul Alimentar",
    retete: "Planuri de Mese",
    analiza: "Analiza Obiceiurilor",
    profil: "Profilul Meu",
  };

  const tabDescriptions = {
    chat: "Vorbește cu antrenorul tău personal AI",
    jurnal: "Urmărește progresul zilnic și caloriile",
    retete: "Descoperă rețete personalizate pentru obiectivele tale",
    analiza: "Analizează obiceiurile și preferințele alimentare",
    profil: "Configurează setările și obiectivele tale",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {tabTitles[activeTab]}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {tabDescriptions[activeTab]}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          {userProfile?.daily_calorie_goal && (
            <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {userProfile.daily_calorie_goal}
                </div>
                <div className="text-xs text-gray-500">Obiectiv zilnic</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {userProfile.weight || "?"}kg
                </div>
                <div className="text-xs text-gray-500">Greutate</div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-600"
              >
                <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notificări</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Obiectiv atins!
                      </p>
                      <p className="text-xs text-gray-600">
                        Ai atins obiectivul de proteine pentru azi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      💪
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Reamintire antrenament
                      </p>
                      <p className="text-xs text-gray-600">
                        E timpul pentru antrenamentul de azi
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Vezi toate notificările
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Caută rețete, alimente..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute left-3 top-3 text-gray-400"
              >
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
