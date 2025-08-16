"use client";

import { useState, useRef, useEffect } from "react";

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

interface PendingEntry {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: "dimineata" | "amiaza" | "seara";
  date: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface NaturalChatProps {
  userProfile?: UserProfile;
  onPendingEntries: (entries: PendingEntry[]) => void;
}

export default function NaturalChat({
  userProfile,
  onPendingEntries,
}: NaturalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mesaj de bun venit la încărcare
  useEffect(() => {
    const firstName = userProfile?.full_name?.split(" ")[0] || "prietene";
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Bună, ${firstName}! 👋

Sunt Alex, asistentul tău personal pentru nutriție. Sunt aici să te ajut cu:

🍽️ **Înregistrarea meselor** - spune-mi ce mănânci
📊 **Analiza nutrienților** - calculez automat caloriile
🥗 **Sfaturi personalizate** - recomandări pentru obiectivele tale
❓ **Răspunsuri la întrebări** - orice despre alimentație sănătoasă

${
  userProfile?.daily_calorie_goal
    ? `🎯 Obiectivul tău zilnic: ${userProfile.daily_calorie_goal} calorii`
    : ""
}

Cum te pot ajuta astăzi?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, [userProfile]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/natural-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage.trim(),
          user_profile: userProfile,
          conversation_history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Dacă AI-ul a detectat mâncare și a generat intrări
        if (data.pending_entries && data.pending_entries.length > 0) {
          onPendingEntries(data.pending_entries);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog să încerci din nou.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Îmi pare rău, nu am putut procesa mesajul. Verifică conexiunea și încearcă din nou.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exampleMessages = [
    "Am mâncat două ouă fierte și o felie de pâine la micul dejun",
    "Câte calorii are o salată Caesar?",
    "Ce să mănânc la cină pentru a-mi atinge obiectivul?",
    "Am băut un smoothie cu banană și căpșuni",
    "Poți să îmi recomanzi o masă bogată în proteine?",
    "Ce fructe sunt cele mai sănătoase?",
  ];

  return (
    <div className="h-[calc(100vh-180px)] bg-gray-50 rounded-3xl shadow-lg overflow-hidden flex flex-col">
      {/* Header simplu și elegant */}
      <div className="bg-white border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">A</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Alex</h3>
              <p className="text-sm text-gray-500">
                Asistentul tău de nutriție
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Container pentru mesaje */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-gray-600">Se încarcă...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Hai să vorbim despre nutriție!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Spune-mi ce ai mâncat sau întreabă-mă orice despre alimentație
              sănătoasă
            </p>

            {/* Carduri cu sugestii */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {exampleMessages.slice(0, 6).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(example)}
                  className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <span className="text-blue-500 text-sm">
                        {index === 0
                          ? "🍳"
                          : index === 1
                          ? "❓"
                          : index === 2
                          ? "🥗"
                          : index === 3
                          ? "🥤"
                          : index === 4
                          ? "🥩"
                          : "🍎"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        {example}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end space-x-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">Tu</span>
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-end space-x-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area modernă */}
      <div className="border-t border-gray-100 bg-white p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Spune-mi ce ai mâncat sau întreabă-mă orice..."
              disabled={loading}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32"
              rows={1}
              style={{
                minHeight: "48px",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "48px";
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
