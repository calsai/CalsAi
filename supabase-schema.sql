-- Crearea tabelelor pentru aplicația de nutriție

-- Tabel pentru profilurile utilizatorilor
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    age INTEGER,
    weight DECIMAL(5,2), -- kg
    height INTEGER, -- cm
    gender TEXT CHECK (gender IN ('male', 'female')),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
    daily_calorie_goal INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel pentru intrările alimentare
CREATE TABLE food_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    food_name TEXT NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fat DECIMAL(6,2),
    meal_time TEXT CHECK (meal_time IN ('dimineata', 'amiaza', 'seara')) NOT NULL,
    date DATE NOT NULL,
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel pentru mesajele din chat
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    message_type TEXT CHECK (message_type IN ('nutrition', 'recipe', 'general')) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel pentru rețete
CREATE TABLE recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    prep_time INTEGER NOT NULL, -- minute
    cook_time INTEGER DEFAULT 0, -- minute
    servings INTEGER DEFAULT 1,
    calories_per_serving DECIMAL(8,2) NOT NULL,
    protein_per_serving DECIMAL(6,2) DEFAULT 0,
    carbs_per_serving DECIMAL(6,2) DEFAULT 0,
    fat_per_serving DECIMAL(6,2) DEFAULT 0,
    tags TEXT[],
    ai_generated BOOLEAN DEFAULT false,
    prompt_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexuri pentru performanță
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX idx_food_entries_date ON food_entries(date);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_recipes_user_id ON recipes(user_id);

-- RLS (Row Level Security) pentru securitate
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Politici RLS pentru profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Politici RLS pentru food_entries
CREATE POLICY "Users can view own food entries" ON food_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own food entries" ON food_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food entries" ON food_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food entries" ON food_entries FOR DELETE USING (auth.uid() = user_id);

-- Politici RLS pentru chat_messages
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politici RLS pentru recipes
CREATE POLICY "Users can view own recipes" ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Trigger pentru a actualiza updated_at în profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
