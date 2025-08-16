import { createBrowserClient } from "@supabase/ssr";

// Temporar hardcodat pentru testare
const supabaseUrl = "https://qbjfxprdlssozwylctrt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiamZ4cHJkbHNzb3p3eWxjdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTU0NzEsImV4cCI6MjA2OTczMTQ3MX0.CwqHvxdcNdfS_wI_eXz7IHG1J_PBRgox8XSamZP8HHg";

// Client pentru componentele browser
export const createSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Tipuri pentru baza de date
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          age: number | null;
          weight: number | null;
          height: number | null;
          activity_level:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          goal: "lose" | "maintain" | "gain" | null;
          daily_calorie_goal: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          age?: number | null;
          weight?: number | null;
          height?: number | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          goal?: "lose" | "maintain" | "gain" | null;
          daily_calorie_goal?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          age?: number | null;
          weight?: number | null;
          height?: number | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          goal?: "lose" | "maintain" | "gain" | null;
          daily_calorie_goal?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_entries: {
        Row: {
          id: string;
          user_id: string;
          food_name: string;
          calories: number;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          meal_time: "dimineata" | "amiaza" | "seara";
          date: string;
          confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_name: string;
          calories: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          meal_time: "dimineata" | "amiaza" | "seara";
          date: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_name?: string;
          calories?: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          meal_time?: "dimineata" | "amiaza" | "seara";
          date?: string;
          confirmed?: boolean;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          is_user: boolean;
          message_type: "nutrition" | "recipe" | "general";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          is_user: boolean;
          message_type?: "nutrition" | "recipe" | "general";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          is_user?: boolean;
          message_type?: "nutrition" | "recipe" | "general";
          created_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          ingredients: string[];
          instructions: string;
          calories: number;
          prep_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          ingredients: string[];
          instructions: string;
          calories: number;
          prep_time: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          ingredients?: string[];
          instructions?: string;
          calories?: number;
          prep_time?: number;
          created_at?: string;
        };
      };
    };
  };
}
