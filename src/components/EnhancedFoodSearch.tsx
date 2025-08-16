"use client";

import { useState, useEffect } from "react";
import { searchRomanianFoods, RomanianFood, foodCategories, getRomanianFoodsByCategory } from "@/data/romanian-foods";

interface EnhancedFoodSearchProps {
  onFoodSelect: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion?: { name: string; grams: number };
  }) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedFoodSearch({ onFoodSelect, isOpen, onClose }: EnhancedFoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RomanianFood[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchMode, setSearchMode] = useState<"search" | "category" | "barcode">("search");

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchRomanianFoods(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleCategorySearch = (category: string) => {
    setSelectedCategory(category);
    setSearchMode("category");
    if (category === "all") {
      setSearchResults([]);
    } else {
      const { getRomanianFoodsByCategory } = require("@/data/romanian-foods");
      const results = getRomanianFoodsByCategory(category);
      setSearchResults(results);
    }
  };

  const handleFoodSelection = (food: RomanianFood, portion?: { name: string; grams: number }) => {
    const multiplier = portion ? portion.grams / 100 : 1;
    
    onFoodSelect({
      name: `${food.name}${portion ? ` (${portion.name})` : ""}`,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      portion
    });
    
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleBarcodeSearch = async () => {
    if (!barcodeInput.trim()) return;
    
    try {
      // Aici ar fi integrarea cu o API de coduri de bare
      // Pentru demo, simulez o căutare
      alert(`Căutarea pentru codul de bare ${barcodeInput} nu este încă implementată. Va fi adăugată în versiunea viitoare!`);
    } catch (error) {
      console.error("Error searching barcode:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔍 Caută alimente</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Tabs pentru modul de căutare */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setSearchMode("search")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchMode === "search" 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              🔍 Caută
            </button>
            <button
              onClick={() => setSearchMode("category")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchMode === "category" 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              📂 Categorii
            </button>
            <button
              onClick={() => setSearchMode("barcode")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchMode === "barcode" 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              📷 Cod de bare
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {/* Search mode */}
          {searchMode === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută alimente românești... (ex: piept de pui, telemea, sarmale)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                  autoFocus
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </span>
              </div>
              
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-4 block">🤷‍♂️</span>
                  <p>Nu am găsit alimente pentru "{searchQuery}"</p>
                  <p className="text-sm mt-2">Încearcă termeni precum: pui, brânză, cartofi, etc.</p>
                </div>
              )}
            </div>
          )}

          {/* Category mode */}
          {searchMode === "category" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {foodCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySearch(category)}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-800">{category}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Barcode mode */}
          {searchMode === "barcode" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <span className="text-6xl mb-4 block">📷</span>
                <h3 className="text-xl font-bold mb-2">Scanează codul de bare</h3>
                <p className="text-gray-600 mb-4">
                  Introdu manual codul de bare sau scanează-l cu camera
                </p>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Introdu codul de bare..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleBarcodeSearch}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  Caută
                </button>
              </div>
              
              <div className="text-center">
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  📱 Scanează cu camera (în curând)
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Rezultate găsite ({searchResults.length})
              </h3>
              
              {searchResults.map((food) => (
                <div key={food.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{food.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{food.category}</p>
                      
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>🔥 {food.calories} kcal</span>
                        <span>🥩 {food.protein}g proteină</span>
                        <span>🍞 {food.carbs}g carbo</span>
                        <span>🧈 {food.fat}g grăsime</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">Per 100g</p>
                    </div>
                  </div>
                  
                  {/* Porții comune */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selectează porția:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFoodSelection(food)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        100g (standard)
                      </button>
                      {food.common_portions.map((portion, index) => (
                        <button
                          key={index}
                          onClick={() => handleFoodSelection(food, portion)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          {portion.name} ({portion.grams}g)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
