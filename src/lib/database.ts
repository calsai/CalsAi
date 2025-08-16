// Tipuri pentru baza de date
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  food: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time: "dimineata" | "amiaza" | "seara";
  date: string; // YYYY-MM-DD format
  timestamp: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  prepTime: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  text: string;
  isUser: boolean;
  type: "nutrition" | "recipe";
  timestamp: string;
}

// Simulare bază de date în memorie pentru demo
class InMemoryDB {
  private users: Map<string, User> = new Map();
  private foodEntries: Map<string, FoodEntry[]> = new Map();
  private recipes: Map<string, Recipe[]> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();

  // User management
  async createUser(email: string, name: string): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const user: User = {
      id: userId,
      email,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.set(userId, user);
    this.foodEntries.set(userId, []);
    this.recipes.set(userId, []);
    this.messages.set(userId, []);

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  // Food entries
  async addFoodEntry(
    userId: string,
    entry: Omit<FoodEntry, "id" | "user_id">
  ): Promise<FoodEntry> {
    const foodEntry: FoodEntry = {
      id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      ...entry,
    };

    const userEntries = this.foodEntries.get(userId) || [];
    userEntries.push(foodEntry);
    this.foodEntries.set(userId, userEntries);

    return foodEntry;
  }

  async getFoodEntries(userId: string, date?: string): Promise<FoodEntry[]> {
    const userEntries = this.foodEntries.get(userId) || [];

    if (date) {
      return userEntries.filter((entry) => entry.date === date);
    }

    return userEntries;
  }

  // Recipes
  async addRecipe(
    userId: string,
    recipe: Omit<Recipe, "id" | "user_id" | "created_at">
  ): Promise<Recipe> {
    const newRecipe: Recipe = {
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      ...recipe,
    };

    const userRecipes = this.recipes.get(userId) || [];
    userRecipes.push(newRecipe);
    this.recipes.set(userId, userRecipes);

    return newRecipe;
  }

  async getRecipes(userId: string): Promise<Recipe[]> {
    return this.recipes.get(userId) || [];
  }

  // Chat messages
  async addMessage(
    userId: string,
    message: Omit<ChatMessage, "id" | "user_id">
  ): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      ...message,
    };

    const userMessages = this.messages.get(userId) || [];
    userMessages.push(newMessage);
    this.messages.set(userId, userMessages);

    return newMessage;
  }

  async getMessages(
    userId: string,
    type?: "nutrition" | "recipe"
  ): Promise<ChatMessage[]> {
    const userMessages = this.messages.get(userId) || [];

    if (type) {
      return userMessages.filter((msg) => msg.type === type);
    }

    return userMessages;
  }
}

// Singleton instance
export const db = new InMemoryDB();

// Funcții helper pentru localStorage backup
export const saveToLocalStorage = (key: string, data: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Funcție pentru obținerea utilizatorului curent
export const getCurrentUser = (): User | null => {
  return loadFromLocalStorage("currentUser");
};

// Funcție pentru setarea utilizatorului curent
export const setCurrentUser = (user: User) => {
  saveToLocalStorage("currentUser", user);
};
