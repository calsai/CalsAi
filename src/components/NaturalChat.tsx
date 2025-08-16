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

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Încărcare sesiuni din localStorage și încărcarea ultimei sesiuni active
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    const lastActiveSessionId = localStorage.getItem("lastActiveSessionId");

    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      // Convertim timestamp-urile din string înapoi în Date
      const sessionsWithDates = sessions.map((session: ChatSession) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        messages: session.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setChatSessions(sessionsWithDates);

      // Încarcă ultima sesiune activă dacă există
      if (lastActiveSessionId && sessionsWithDates.length > 0) {
        const lastSession = sessionsWithDates.find(
          (s: ChatSession) => s.id === lastActiveSessionId
        );
        if (lastSession) {
          setCurrentSessionId(lastSession.id);
          setMessages(lastSession.messages);
          return; // Nu afișa mesajul de bun venit dacă încărcăm o sesiune
        }
      }
    }

    // Creează o sesiune nouă DOAR dacă nu există niciuna salvată
    if (!savedSessions || JSON.parse(savedSessions).length === 0) {
      const newSessionId = Date.now().toString();
      setCurrentSessionId(newSessionId);
      localStorage.setItem("lastActiveSessionId", newSessionId);
    }
  }, []);

  // Salvare sesiuni în localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
    setChatSessions(sessions);
  };

  // Crearea unei noi sesiuni
  const createNewSession = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setShowHistory(false);
    // Salvează ca sesiune activă
    localStorage.setItem("lastActiveSessionId", newSessionId);
  };

  // Salvarea sesiunii curente
  const saveCurrentSession = (updatedMessages: Message[]) => {
    if (!currentSessionId || updatedMessages.length === 0) return;

    const firstUserMessage = updatedMessages.find((m) => m.role === "user");
    const title = firstUserMessage
      ? firstUserMessage.content.substring(0, 50) +
        (firstUserMessage.content.length > 50 ? "..." : "")
      : "Conversație nouă";

    const lastMessage = updatedMessages[updatedMessages.length - 1];

    const newSession: ChatSession = {
      id: currentSessionId,
      title,
      lastMessage:
        lastMessage.content.substring(0, 100) +
        (lastMessage.content.length > 100 ? "..." : ""),
      timestamp: new Date(),
      messages: updatedMessages,
    };

    const existingIndex = chatSessions.findIndex(
      (s) => s.id === currentSessionId
    );
    let updatedSessions;

    if (existingIndex >= 0) {
      updatedSessions = [...chatSessions];
      updatedSessions[existingIndex] = newSession;
    } else {
      updatedSessions = [newSession, ...chatSessions];
    }

    saveSessions(updatedSessions);

    // Salvează sesiunea activă
    localStorage.setItem("lastActiveSessionId", currentSessionId);
  };

  // Încărcarea unei sesiuni existente
  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
    // Salvează ca sesiune activă
    localStorage.setItem("lastActiveSessionId", session.id);
  };

  // Ștergerea unei sesiuni
  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter((s) => s.id !== sessionId);
    saveSessions(updatedSessions);

    if (currentSessionId === sessionId) {
      createNewSession();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mesaj de bun venit la încărcare - doar pentru sesiuni noi
  useEffect(() => {
    if (currentSessionId && messages.length === 0) {
      const savedSessions = localStorage.getItem("chatSessions");
      const isFirstTimeUser =
        !savedSessions || JSON.parse(savedSessions).length === 0;

      if (isFirstTimeUser) {
        const firstName = userProfile?.full_name?.split(" ")[0] || "client";
        const welcomeMessage: Message = {
          id: "welcome",
          role: "assistant",
          content: `Salut ${firstName}! �

Sunt Alex, antrenorul tău personal și nutriționist. Sunt aici să-ți creez planuri personalizate de:

�️ **ANTRENAMENT** - programe complete, exerciții, progresie
🍽️ **NUTRIȚIE** - planuri de mese, macros, timing
📊 **TRACKING** - progres, măsurători, obiective
🧠 **MINDSET** - motivație, obiceiuri, discipline

${
  userProfile?.daily_calorie_goal
    ? `🎯 Target zilnic: ${userProfile.daily_calorie_goal} calorii`
    : "📋 Hai să-ți calculez primul plan personalizat!"
}

Spune-mi: care este situația ta actuală și ce vrei să îmbunătățești? Vreau să știu totul - nivel de fitness, experiență, timp disponibil, preferințe alimentare. Cu cât îmi spui mai multe, cu atât pot să te ajut mai eficient!`,
          timestamp: new Date(),
        };

        setMessages([welcomeMessage]);
      }
    }
  }, [userProfile, currentSessionId, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    // Creăm o sesiune nouă dacă nu există una
    const sessionId = currentSessionId || Date.now().toString();
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        // Salvăm sesiunea cu toate mesajele
        saveCurrentSession(finalMessages);

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
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
        saveCurrentSession(finalMessages);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Îmi pare rău, nu am putut procesa mesajul. Verifică conexiunea și încearcă din nou.",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
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

  // Funcție pentru formatarea textului cu markdown simplu
  const formatMessage = (content: string) => {
    return (
      content
        // Bold text **text** → <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Emojis pentru titluri (păstrează spațierea)
        .replace(
          /^(💪|🏋️|📊|🍽️|🎯|⚠️|✅|❌|📋|💡|🔍|❓)\s*\*\*(.*?)\*\*/gm,
          '<div class="mt-4 mb-2"><span class="text-lg">$1</span> <strong class="text-lg font-semibold text-blue-700">$2</strong></div>'
        )
        // Bullet points • text → <li>text</li>
        .replace(/^•\s*(.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
        // Linii noi duble pentru paragrafe
        .replace(/\n\n/g, '</p><p class="mt-3">')
        // Linii simple
        .replace(/\n/g, "<br/>")
        // Wrap în paragraf
        .replace(/^(.)/g, "<p>$1")
        .replace(/(.)$/g, "$1</p>")
        // Fix pentru liste
        .replace(/<p><li/g, "<ul><li")
        .replace(/li><\/p>/g, "li></ul>")
    );
  };

  const exampleMessages = [
    "Am mâncat două ouă fierte și ovăz cu fructe la micul dejun",
    "Vreau un plan de antrenament pentru slăbire",
    "Nu știu ce să mănânc să-mi ating obiectivul zilnic",
    "Cum calculez macronutrienții pentru masa musculară?",
    "Poți să-mi faci un plan de masă pentru săptămâna asta?",
    "Ce exerciții sunt cele mai eficiente pentru abdomen?",
  ];

  return (
    <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header Chat */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Alex - AI Trainer</h3>
              <p className="text-white/80 text-sm">
                Antrenorul tău personal și nutriționist
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200 backdrop-blur"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
              </svg>
              <span className="text-sm text-white">Istoric</span>
            </button>
            <button
              onClick={createNewSession}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 hover:bg-gray-50 rounded-xl transition-colors duration-200 font-medium"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              <span className="text-sm">Chat nou</span>
            </button>
          </div>
        </div>
      </div>

      {/* Container pentru mesaje */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {showHistory ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800">
                Conversații anterioare
              </h4>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>

            {chatSessions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <path d="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H6L2,22V4C2,2.89 2.9,2 4,2H20M4,4V18L6,16H20V4H4Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nu ai conversații salvate încă
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Începe să vorbești cu Alex pentru a salva și urmări
                  conversațiile tale
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
                    onClick={() => loadSession(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-lg mb-2">
                          {session.title}
                        </h5>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                            <span>
                              {session.timestamp.toLocaleDateString("ro-RO")}{" "}
                              {session.timestamp.toLocaleTimeString("ro-RO", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H6L2,22V4C2,2.89 2.9,2 4,2H20M4,4V18L6,16H20V4H4Z" />
                            </svg>
                            <span>{session.messages.length} mesaje</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">�</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Bună! Să începem antrenamentul! 💪
                </h3>
                <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
                  Sunt Alex, antrenorul tău personal AI. Spune-mi despre
                  obiectivele tale și să creăm împreună planul perfect!
                </p>

                {/* Carduri cu sugestii moderne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {exampleMessages.slice(0, 6).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(example)}
                      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left group hover:scale-105"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-green-100 transition-colors">
                          <span className="text-2xl">
                            {index === 0
                              ? "🍳"
                              : index === 1
                              ? "🏋️"
                              : index === 2
                              ? "🥗"
                              : index === 3
                              ? "📊"
                              : index === 4
                              ? "📋"
                              : "💪"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium leading-relaxed group-hover:text-blue-700 transition-colors">
                            {example}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end space-x-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          A
                        </span>
                      </div>
                    )}

                    <div
                      className={`max-w-xl px-6 py-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-800 shadow-sm border border-gray-100"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div
                          className="prose prose-sm max-w-none leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.content),
                          }}
                        />
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                      <p
                        className={`text-xs mt-3 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-sm font-semibold">
                          Tu
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-end space-x-4 justify-start">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area modernă */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Spune-mi despre antrenament, nutriție sau obiectivele tale..."
              disabled={loading}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32 placeholder-gray-500"
              rows={1}
              style={{
                minHeight: "56px",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "56px";
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>
            Apasă Enter pentru a trimite, Shift+Enter pentru linie nouă
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Alex este online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
