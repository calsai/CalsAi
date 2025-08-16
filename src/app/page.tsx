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
import FoodAnalytics from "@/components/FoodAnalytics";

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

  useEffect(() => {
    if (user && !loading) {
      loadUserProfile();
    }
  }, [user, loading]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (data.success && data.profile) {
        setUserProfile(data.profile);
        console.log("Profile loaded:", data.profile);
      } else {
        console.log("No profile found, setting up...");
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setShowProfileSetup(true);
    }
  };

  const handlePendingEntries = (entries: PendingEntry[]) => {
    if (entries.length > 0) {
      setPendingEntries(entries);
      setShowConfirmation(true);
    }
  };

  const confirmEntries = async () => {
    try {
      const response = await fetch("/api/food-journal", {
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

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <div className="max-w-4xl mx-auto">
            <NaturalChat
              userProfile={userProfile || undefined}
              onPendingEntries={handlePendingEntries}
            />
          </div>
        );

      case "jurnal":
        return (
          <div className="max-w-6xl mx-auto">
            <FoodJournal userProfile={userProfile || undefined} />
          </div>
        );

      case "retete":
        return (
          <div className="max-w-6xl mx-auto">
            <RecipeGenerator userProfile={userProfile || undefined} />
          </div>
        );

      case "analiza":
        return (
          <div className="max-w-6xl mx-auto">
            <FoodAnalytics userProfile={userProfile || undefined} />
          </div>
        );

      case "profil":
        return (
          <div className="max-w-2xl mx-auto">
            <ProfileSetup
              userProfile={userProfile || undefined}
              onProfileUpdate={loadUserProfile}
              embedded={true}
            />
          </div>
        );

      default:
        return null;
    }
  };

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
          <p className="text-gray-600">
            Pregătim experiența ta personalizată...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AuthModal show={true} onClose={() => setShowAuthModal(false)} />
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
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
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
