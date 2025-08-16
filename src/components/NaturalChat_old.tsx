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
  session_id?: string;
}

interface ChatSession {
  id: string;
  created_at: Date;
  title: string;
  message_count: number;
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
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Funcție pentru a crea o sesiune nouă după 15 minute de inactivitate
  const createNewSessionIfNeeded = () => {
    const now = new Date();
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && currentSessionId) {
      const timeDiff = now.getTime() - lastMessage.timestamp.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      // Dacă au trecut 15 minute, creează o sesiune nouă
      if (minutesDiff >= 15) {
        const newSessionId = `session_${now.getTime()}`;
        setCurrentSessionId(newSessionId);
        return newSessionId;
      }
    }

    return currentSessionId;
  };

  // Funcție pentru a încărca sesiunile de chat
  const loadChatSessions = async () => {
    try {
      const response = await fetch("/api/chat-sessions");
      const data = await response.json();

      if (data.success && data.sessions) {
        setChatSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    }
  };

  // Funcție pentru a încărca mesajele unei sesiuni specifice
  const loadSessionMessages = async (sessionId: string) => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`/api/natural-chat?session_id=${sessionId}`);
      const data = await response.json();

      if (data.success && data.messages) {
        const chatMessages: Message[] = data.messages.map(
          (msg: {
            id?: string;
            is_user: boolean;
            message: string;
            created_at: string;
            session_id?: string;
          }) => ({
            id: msg.id || Date.now().toString(),
            role: msg.is_user ? "user" : "assistant",
            content: msg.message,
            timestamp: new Date(msg.created_at),
            session_id: msg.session_id,
          })
        );

        setMessages(chatMessages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error("Error loading session messages:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Funcție pentru a crea o sesiune nouă
  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setShowSessions(false);

    // Adaugă mesajul de bun venit pentru sesiunea nouă
    const welcomeMessage: Message = {
      id: "welcome_" + newSessionId,
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
      session_id: newSessionId,
    };
    setMessages([welcomeMessage]);
  };

  // Funcție pentru mesajul de bun venit îmbunătățit
  const getWelcomeMessage = () => {
    const firstName = userProfile?.full_name
      ? userProfile.full_name.split(" ")[0]
      : "prietene";
    const currentHour = new Date().getHours();
    let greeting = "Bună";

    if (currentHour < 12) greeting = "Bună dimineața";
    else if (currentHour < 18) greeting = "Bună ziua";
    else greeting = "Bună seara";

    return `${greeting}, ${firstName}! 👋

Sunt **Alex**, nutritionistul tău personal AI, și sunt aici să îți transform experiența cu alimentația într-una plăcută și eficientă! 🎯

**Ce pot face pentru tine:**
🍽️ **Înregistrез mesele** - spune-mi ce mănânci și adaug automat în jurnal
📊 **Analizez nutrienții** - îți calculez caloriile, proteinele, carbohidrații și grăsimile
🥗 **Sugerez alternative** - recomandări pentru mese mai sănătoase
📈 **Trackez progresul** - te ajut să îți atingi obiectivele de greutate
💡 **Răspund la întrebări** - orice curiozitate despre nutriție

**Exemple de cum mă poți folosi:**
• "Am mâncat 200g piept de pui la grătar cu salată"
• "Ce alternative mai sănătoase ai pentru pizza?"
• "Câte calorii am mai rămas pentru astăzi?"
• "Sugerează-mi o cină ușoară sub 400 calorii"

${
  userProfile?.daily_calorie_goal
    ? `🎯 **Obiectivul tău zilnic:** ${userProfile.daily_calorie_goal} calorii`
    : ""
}

Hai să începem! Ce ai mâncat astăzi sau cu ce te pot ajuta? 😊`;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Încarcă istoricul de chat la pornire
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setLoadingHistory(true);

        // Încarcă sesiunile disponibile
        await loadChatSessions();

        // Verifică dacă există o sesiune activă recentă (ultimele 15 minute)
        const response = await fetch("/api/natural-chat?recent=true");
        const data = await response.json();

        if (data.success && data.messages && data.messages.length > 0) {
          const lastMessage = data.messages[data.messages.length - 1];
          const timeDiff =
            new Date().getTime() - new Date(lastMessage.created_at).getTime();
          const minutesDiff = timeDiff / (1000 * 60);

          if (minutesDiff < 15) {
            // Continuă sesiunea existentă
            const chatMessages: Message[] = data.messages.map(
              (msg: {
                id?: string;
                is_user: boolean;
                message: string;
                created_at: string;
                session_id?: string;
              }) => ({
                id: msg.id || Date.now().toString(),
                role: msg.is_user ? "user" : "assistant",
                content: msg.message,
                timestamp: new Date(msg.created_at),
                session_id: msg.session_id,
              })
            );

            setMessages(chatMessages);
            setCurrentSessionId(data.session_id || `session_${Date.now()}`);
          } else {
            // Creează o sesiune nouă
            createNewSession();
          }
        } else {
          // Primul chat - creează o sesiune nouă
          createNewSession();
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        // În caz de eroare, creează o sesiune nouă
        createNewSession();
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [userProfile]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    // Verifică dacă trebuie să creeze o sesiune nouă
    const sessionId = createNewSessionIfNeeded() || `session_${Date.now()}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      session_id: sessionId,
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
          session_id: sessionId,
          user_profile: userProfile,
          conversation_history: messages.slice(-6).map((m) => ({
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
          session_id: sessionId,
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
          session_id: sessionId,
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
        session_id: sessionId,
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

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString("ro-RO", {
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
  ];

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">Alex - AI Nutriționist</h3>
            <p className="text-blue-100 text-sm">
              Asistentul tău personal pentru o alimentație sănătoasă
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              title="Istoric conversații"
            >
              <span className="text-lg">📚</span>
            </button>
            <button
              onClick={createNewSession}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              title="Conversație nouă"
            >
              <span className="text-lg">➕</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-100">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Sidebar */}
      {showSessions && (
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">
            Conversații recente
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-32 overflow-y-auto">
            {chatSessions.length > 0 ? (
              chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadSessionMessages(session.id)}
                  className={`p-3 text-left bg-white rounded-lg border text-sm transition-all hover:shadow-md ${
                    currentSessionId === session.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium text-gray-800 truncate">
                    {session.title}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {session.message_count} mesaje •{" "}
                    {formatTime(session.created_at)}
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-sm py-4">
                Nicio conversație anterioară
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white"
        style={{ height: "calc(100% - 140px)" }}
      >
        {loadingHistory ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-gray-600">Se încarcă conversația...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Începe conversația!
            </h3>
            <p className="text-gray-600 mb-6">
              Spune-mi ce ai mâncat sau întreabă-mă orice despre nutriție
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {exampleMessages.slice(0, 4).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(example)}
                  className="p-3 text-left bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700 hover:text-blue-600"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } items-end space-x-3`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              )}

              <div
                className={`max-w-[75%] ${
                  message.role === "user" ? "order-1" : ""
                }`}
              >
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white text-gray-800 shadow-md border border-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {userProfile?.full_name
                      ? userProfile.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start items-end space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
              <div className="flex space-x-2">
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

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Scrie un mesaj... (Shift + Enter pentru linie nouă)"
              disabled={loading}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 text-sm"
              style={{ maxHeight: "120px" }}
            />
            {inputMessage.trim() && (
              <button
                onClick={() => setInputMessage("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center min-w-[48px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-xl">🚀</span>
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Powered by Perplexity AI • Datele tale sunt securizate și private
        </div>
      </div>
    </div>
  );
}
