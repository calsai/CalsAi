-- Script pentru actualizarea tabelei profiles - adăugarea coloanei daily_calorie_goal

-- Verifică dacă coloana daily_calorie_goal există deja
DO $$
BEGIN
    -- Încearcă să adaugi coloana daily_calorie_goal
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'daily_calorie_goal'
    ) THEN
        -- Adaugă coloana nouă
        ALTER TABLE profiles ADD COLUMN daily_calorie_goal INTEGER;
        
        -- Dacă exists daily_calories, copiază valorile
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'daily_calories'
        ) THEN
            -- Copiază valorile din daily_calories în daily_calorie_goal
            UPDATE profiles SET daily_calorie_goal = daily_calories;
            
            -- Șterge coloana veche daily_calories
            ALTER TABLE profiles DROP COLUMN daily_calories;
        END IF;
        
        RAISE NOTICE 'Coloana daily_calorie_goal a fost adăugată cu succes!';
    ELSE
        RAISE NOTICE 'Coloana daily_calorie_goal există deja.';
    END IF;
END $$;
