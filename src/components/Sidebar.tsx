"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userProfile?: UserProfile | null;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  userProfile,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "chat" as TabType,
      name: "Chat AI",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
        </svg>
      ),
      description: "Vorbește cu Alex",
    },
    {
      id: "jurnal" as TabType,
      name: "Jurnal",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      ),
      description: "Tracking zilnic",
    },
    {
      id: "retete" as TabType,
      name: "Rețete",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.28,12.92 16.28,15.18 14.88,16.58C13.49,17.97 11.23,17.97 9.83,16.58L7.03,13.78L9.86,10.96L14.88,11.53Z" />
        </svg>
      ),
      description: "Planuri de mese",
    },
    {
      id: "analiza" as TabType,
      name: "Analiză",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
        </svg>
      ),
      description: "Obiceiuri alimentare",
    },
    {
      id: "profil" as TabType,
      name: "Profil",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
        </svg>
      ),
      description: "Setări cont",
    },
  ];

  const firstName =
    userProfile?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header Sidebar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                FitTracker
              </h1>
              <p className="text-xs text-gray-500 mt-1">by Alex AI</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`text-gray-600 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            >
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div
                className={`${
                  activeTab === item.id
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {firstName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {userProfile?.daily_calorie_goal
                    ? `${userProfile.daily_calorie_goal} cal/zi`
                    : "Configurează profilul"}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={signOut}
          className={`w-full flex items-center space-x-3 px-3 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
          </svg>
          {!isCollapsed && <span className="text-sm font-medium">Ieșire</span>}
        </button>
      </div>
    </div>
  );
}
