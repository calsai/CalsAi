-- Tabele necesare pentru istoric chat cu sesiuni

-- PASUL 1: Creează tabela pentru sesiuni de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
    id text PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Conversație nouă',
    message_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- PASUL 2: Verifică dacă tabela chat_messages există și o creează sau o modifică
DO $$
BEGIN
    -- Încearcă să creeze tabela dacă nu există
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
        CREATE TABLE chat_messages (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
            session_id text REFERENCES chat_sessions(id) ON DELETE CASCADE,
            message text NOT NULL,
            is_user boolean NOT NULL DEFAULT true,
            created_at timestamp with time zone DEFAULT now()
        );
    ELSE
        -- Dacă tabela există, adaugă coloana session_id dacă nu există
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'chat_messages' AND column_name = 'session_id') THEN
            ALTER TABLE chat_messages ADD COLUMN session_id text;
            
            -- Setează o valoare default pentru înregistrările existente
            UPDATE chat_messages SET session_id = 'legacy_session_' || user_id::text 
            WHERE session_id IS NULL;
            
            -- Adaugă constraint-ul după ce am populat datele
            ALTER TABLE chat_messages ALTER COLUMN session_id SET NOT NULL;
        END IF;
    END IF;
END $$;

-- RLS pentru chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS pentru chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index-uri pentru performanță
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- PASUL 3: Creează sau recreează triggerul pentru message_count
DROP TRIGGER IF EXISTS trigger_update_message_count ON chat_messages;
DROP FUNCTION IF EXISTS update_session_message_count();

CREATE OR REPLACE FUNCTION update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifică dacă session_id există în chat_sessions, dacă nu îl creează
    INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
    VALUES (NEW.session_id, NEW.user_id, 'Conversație nouă', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Actualizează contorul de mesaje
    UPDATE chat_sessions 
    SET message_count = message_count + 1,
        updated_at = now()
    WHERE id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_count
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_message_count();
