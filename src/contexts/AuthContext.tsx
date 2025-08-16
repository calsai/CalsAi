"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { createSupabaseClient } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("AuthProvider component rendered - BEFORE EVERYTHING");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create supabase client instance
  const supabase = createSupabaseClient();

  console.log("AuthProvider - after useState, loading:", loading);

  // Get initial session and set up auth listener
  useEffect(() => {
    console.log("USEEFFECT IS RUNNING!!!");

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Initial session:", session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  console.log("AuthProvider - after useEffect definition");

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign in error:", error);

        if (error.message.includes("email_not_confirmed")) {
          return {
            error:
              "Te rugăm să confirmi email-ul înainte de a te loga. Verifică inbox-ul pentru linkul de confirmare.",
          };
        }

        if (error.message.includes("invalid_credentials")) {
          return {
            error:
              "Email sau parolă incorectă. Verifică datele și încearcă din nou.",
          };
        }

        return { error: error.message };
      }
      return {};
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "A apărut o eroare la conectare" };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Starting signup process for:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Supabase auth signup error:", error);

        if (error.message.includes("email_address_invalid")) {
          return {
            error:
              "Te rugăm să folosești o adresă de email validă (ex: nume@gmail.com)",
          };
        }

        return { error: error.message };
      }

      console.log("Auth signup successful:", data);

      // Nu mai creez profilul aici - se va crea automat când utilizatorul se loghează
      // Acest lucru evită problemele cu RLS și email confirmation

      if (data.user && !data.user.email_confirmed_at) {
        console.log("User created but needs email confirmation");
        return {
          error: `Un email de confirmare a fost trimis la ${email}. Te rugăm să deschizi linkul din email pentru a-ți activa contul.`,
        };
      }

      console.log("Signup completed successfully");
      return {};
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: "A apărut o eroare la înregistrare" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
