# 🏋️ CalsAi - Weight Loss & Nutrition Tracking

Aplicație web completă pentru managementul slăbirii și nutriției, cu inteligență artificială avansată pentru analiza alimentară și coaching personalizat.

## 🤖 Funcționalități AI & Chat

- **Chat natural cu AI**: Conversație inteligentă pentru logging alimente prin mesaje naturale ("am mâncat 2 ouă și o felie de pâine")
- **Analiza automată cu Perplexity AI**: Extragerea automată a informațiilor nutriționale din text natural
- **Coaching nutrițional cu GitHub AI**: Sfaturi personalizate bazate pe profilul utilizatorului
- **Generare rețete cu Google Gemini**: Sugestii personalizate de rețete pe baza preferințelor și obiectivelor
- **Pattern matching avansat**: Recunoaștere automată a alimentelor românești din conversații

## 📊 Funcționalități principale

- **Jurnal alimentar inteligent**: Tracking calorii și macronutrienți cu adăugare prin chat natural
- **Analytics nutrițional avansat**: Statistici detaliate, analiza modelelor alimentare, distribuția macronutrienților
- **Estimarea automată a nutriției**: Calcul automat pentru alimente necunoscute folosind AI
- **Profil personalizat**: Obiective calorice calculate cu ecuația Harris-Benedict, adaptate la nivelul de activitate
- **Istoricul conversațiilor**: Sesiuni de chat salvate cu contextul păstrat

## 🛠️ Stack Tehnologic

### Frontend

- **Next.js 14+** cu App Router și TypeScript
- **TailwindCSS** pentru styling modern și responsiv
- **React Hook Form** pentru gestionarea formularelor
- **Headless UI** pentru componente accesibile

### Backend & Database

- **Next.js API Routes** pentru backend integrat
- **PostgreSQL** cu **Supabase** pentru baza de date și autentificare
- **Prisma ORM** pentru operațiile cu baza de date
- **Row Level Security (RLS)** pentru securitate avansată

### Integrări AI & APIs

- **Perplexity AI** - Analiza nutrițională din text natural
- **GitHub Models (GPT-4.1)** - Coaching nutrițional și chat inteligent
- **Google Gemini** - Generarea rețetelor personalizate
- **Spoonacular API** - Baza de date de rețete externe
- **Tesseract.js** - OCR pentru scanarea etichetelor (în dezvoltare)

### Autentificare & Securitate

- **Supabase Auth** cu politici RLS
- **NextAuth.js** pentru sesiuni JWT
- **bcryptjs** pentru hashing securizat

## 📁 Structură proiect

### API Routes (`src/app/api/`)

- `natural-chat/` - Chat natural cu AI pentru logging alimente
- `nutrition-coach/` - Coaching personalizat cu GitHub AI
- `smart-chat/` - Chat inteligent cu pattern matching
- `recipe-generator/` - Generare rețete cu Google Gemini
- `estimate-nutrition/` - Estimarea automată a valorilor nutriționale
- `food-analytics/` - Analize și statistici alimentare
- `food-entries/` - CRUD pentru intrările alimentare
- `food-journal/` - Managementul jurnalului zilnic
- `profile/` - Gestionarea profilului utilizatorului
- `auth/` - Autentificare cu NextAuth.js

### Componente UI (`src/components/`)

- `NaturalChat.tsx` - Chat natural cu AI pentru tracking alimente
- `FoodAnalytics.tsx` - Dashboard cu statistici și analize
- `RecipeGenerator.tsx` - Generator de rețete personalizate
- `FoodJournal.tsx` - Jurnal alimentar zilnic
- `ProfileSetup.tsx` - Configurarea profilului utilizatorului
- `EnhancedFoodSearch.tsx` - Căutare avansată de alimente

## 🚀 Instalare și rulare

### Cerințe preliminare

- Node.js 18+
- PostgreSQL sau cont Supabase
- API Keys pentru serviciile AI (opțional)

### 1. Instalează dependențele

```bash
npm install
```

### 2. Configurare variabile de mediu

Creează fișierul `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# AI APIs (opționale)
PERPLEXITY_API_KEY=your_perplexity_key
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_key
SPOONACULAR_API_KEY=your_spoonacular_key
```

### 3. Configurare baza de date

```bash
# Pentru Supabase - rulează schema din supabase-schema.sql
# Pentru PostgreSQL local
npx prisma migrate dev
npx prisma generate
```

### 4. Pornește aplicația

```bash
npm run dev
```

Accesează [http://localhost:3000](http://localhost:3000)

## 🎯 Funcționalități detaliate

### Chat Natural cu AI

- Scrie natural: _"am mâncat 2 ouă și o felie de pâine la micul dejun"_
- AI-ul extrage automat alimentele și le adaugă în jurnal
- Suport pentru alimente românești cu pattern matching
- Conversații salvate cu istoric și context păstrat

### Analytics și Statistici

- Analiza modelelor alimentare pe 7/30/90 zile
- Distribuția macronutrienților cu grafice
- Top alimente consumate și ore de masă preferate
- Analiza dietei cu recomandări AI personalizate

### Generarea Rețetelor

- Rețete personalizate bazate pe profil și preferințe
- Ingrediente disponibile și restricții alimentare
- Calcul automat al valorilor nutriționale
- Timp de preparare și numărul de porții

## 🔧 Configurare API Keys

### Perplexity AI (pentru analiza nutrițională)

1. Creează cont pe [Perplexity](https://www.perplexity.ai/)
2. Obține API key din dashboard
3. Adaugă `PERPLEXITY_API_KEY` în `.env.local`

### GitHub Models (pentru coaching)

1. Accesează [GitHub Models](https://models.github.ai/)
2. Generează Personal Access Token
3. Adaugă `GITHUB_TOKEN` în `.env.local`

### Google Gemini (pentru rețete)

1. Accesează [Google AI Studio](https://aistudio.google.com/)
2. Creează API key gratuit
3. Adaugă `GEMINI_API_KEY` în `.env.local`

## 📊 Schema bazei de date

Aplicația folosește Supabase cu următoarele tabele:

- `profiles` - Informații utilizatori și obiective
- `food_entries` - Intrări alimentare zilnice
- `chat_messages` - Istoricul conversațiilor
- `recipes` - Rețete generate și salvate

Vezi `supabase-schema.sql` pentru schema completă cu RLS policies.

## Documentație API

Toate endpoint-urile API sunt documentate în cod (`src/app/api/`). Folosește TypeScript strict și validare atât pe frontend cât și pe backend.

## Contribuții

Pull requests și sugestii sunt binevenite!
