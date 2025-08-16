"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        // Verifică dacă e mesaj de confirmare email
        if (
          result.error.includes("verifică") ||
          result.error.includes("confirmare")
        ) {
          setSuccess(result.error);
          // Resetează form-ul pentru sign up pentru că a fost de succes
          setEmail("");
          setPassword("");
          setFullName("");
        } else {
          setError(result.error);
        }
        return;
      }

      // Succes - închide modalul
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "A apărut o eroare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? "Conectează-te" : "Creează un cont"}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "Intră în contul tău pentru a continua"
              : "Începe călătoria ta către o alimentație sănătoasă"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numele complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alex Popescu"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="alex@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parola
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Cont creat cu succes!
                  </p>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                  <p className="text-sm text-green-700 mt-2">
                    Deschide linkul din email, apoi revino și loghează-te.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Se procesează...
              </div>
            ) : isLogin ? (
              "Conectează-te"
            ) : (
              "Creează contul"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {success ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Vezi email-ul pentru confirmarea contului
              </p>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setSuccess("");
                  setError("");
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Am confirmat email-ul - Vreau să mă logheze
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin ? (
                <>
                  Nu ai un cont?{" "}
                  <span className="font-medium">Înregistrează-te aici</span>
                </>
              ) : (
                <>
                  Ai deja un cont?{" "}
                  <span className="font-medium">Conectează-te</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
