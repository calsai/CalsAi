"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import ProfileSetup from "@/components/ProfileSetup";
import NaturalChat from "@/components/NaturalChat";
import FoodJournal from "@/components/FoodJournal";
import RecipeGenerator from "@/components/RecipeGenerator";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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

type TabType = "chat" | "jurnal" | "retete" | "profil";

interface PendingEntry {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: "dimineata" | "amiaza" | "seara";
  date: string;
}

export default function HomePage() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  console.log("HomePage render - user:", !!user, "loading:", loading);

  // Încarcă profilul utilizatorului
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Afișează modalul de autentificare dacă utilizatorul nu este conectat
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  const loadUserProfile = async () => {
    console.log("Loading user profile...");
    try {
      const response = await fetch("/api/profile");
      console.log("Profile response status:", response.status);

      const data = await response.json();
      console.log("Profile data:", data);

      if (data.success) {
        setUserProfile(data.profile);
        // Dacă nu are profil complet, afișează setup-ul
        if (!data.profile || !data.profile.age) {
          setShowProfileSetup(true);
        }
      } else {
        console.error("Profile loading failed:", data.error);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handlePendingEntries = (entries: PendingEntry[]) => {
    setPendingEntries(entries);
    setShowConfirmation(true);
  };

  const confirmEntries = async () => {
    try {
      const response = await fetch("/api/food-journal-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          entries: pendingEntries,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowConfirmation(false);
        setPendingEntries([]);
        // Refresh journal if on that tab
        if (activeTab === "jurnal") {
          window.location.reload(); // Simple refresh for now
        }
      }
    } catch (error) {
      console.error("Error confirming entries:", error);
    }
  };

  const tabs = [
    { id: "chat" as TabType, name: "Chat cu Alex", icon: "💬" },
    { id: "jurnal" as TabType, name: "Jurnalul Meu", icon: "📝" },
    { id: "retete" as TabType, name: "Rețete", icon: "🍽️" },
    { id: "profil" as TabType, name: "Profilul Meu", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse mb-6 mx-auto flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white animate-spin"
            >
              <path d="M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Se încarcă FitTracker
          </h3>
          <p className="text-gray-600">Pregătim experiența ta personalizată...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AuthModal
          show={true}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header activeTab={activeTab} userProfile={userProfile} />

        {/* Page Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Bună,{" "}
                  {userProfile?.full_name?.split(" ")[0] ||
                    user.email?.split("@")[0]}
                  ! 👋
                </span>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <span className="hidden sm:inline">Ieși din cont</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-t-lg" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {activeTab === "chat" && (
          <NaturalChat
            userProfile={userProfile || undefined}
            onPendingEntries={handlePendingEntries}
          />
        )}

        {activeTab === "jurnal" && (
          <FoodJournal userProfile={userProfile || undefined} />
        )}

        {activeTab === "retete" && (
          <RecipeGenerator userProfile={userProfile || undefined} />
        )}

        {activeTab === "profil" && (
          <ProfileSetup
            userProfile={userProfile || undefined}
            onProfileUpdate={loadUserProfile}
            embedded={true}
          />
        )}
      </div>

      {/* Modals */}
      {showProfileSetup && !showAuthModal && (
        <ProfileSetup
          userProfile={userProfile || undefined}
          onProfileUpdate={(profile) => {
            setUserProfile(profile);
            setShowProfileSetup(false);
          }}
          onClose={() => setShowProfileSetup(false)}
        />
      )}

      {showConfirmation && (
        <ConfirmationPopup
          entries={pendingEntries}
          onConfirm={confirmEntries}
          onCancel={() => {
            setShowConfirmation(false);
            setPendingEntries([]);
          }}
        />
      )}
    </div>
  );
}
