# 🏋️ Weight Loss Tracking App

## Creat de Onofrei Alexandru

O aplicație web completă pentru ajutarea la slăbire, construită cu Next.js 14, TypeScript, PostgreSQL și TailwindCSS.

## 🌟 Funcționalități Principale

### 📱 Scanare Inteligentă de Produse

- **OCR avansată** cu Tesseract.js pentru extragerea textului din imagini
- **Recunoaștere automată** a informațiilor nutriționale de pe etichete
- **Calculare automată** a caloriilor pe porție sau per 100g
- **Salvare în jurnal** a produselor scanate

### 📊 Jurnal Alimentar Zilnic

- **Tracking complet** al meselor zilnice (mic dejun, prânz, cină, gustări)
- **Monitorizare calorii** și macronutrienți (proteine, carbohidrați, grăsimi)
- **Vizualizare progres** cu grafice și statistici
- **Istoricul zilnic** cu navigare între zile

### 🍽️ Sugestii Personalizate de Rețete

- **Recomandări inteligente** bazate pe caloriile rămase din planul zilnic
- **Filtrare avansată** după tipul de masă și ingrediente excluse
- **Integrare API** cu Spoonacular pentru rețete externe
- **Salvare favorite** și sistem de evaluare

### 👤 Autentificare și Profil Utilizator

- **Autentificare securizată** cu NextAuth.js și JWT
- **Profil personalizat** cu obiective de slăbit
- **Calculare automată** a aportului caloric zilnic folosind ecuația Harris-Benedict
- **Niveluri de activitate** pentru calculul precis al nevoilor calorice

### 🎨 UI Modern și Responsiv

- **Design modern** cu TailwindCSS
- **Complet responsiv** pentru toate dispozitivele
- **Componente reutilizabile** și intuitive
- **Experiență utilizator optimizată**

## 🛠️ Stack Tehnologic

### Frontend

- **Next.js 14** - React framework cu App Router
- **TypeScript** - Type safety și developer experience îmbunătățit
- **TailwindCSS** - Styling modern și responsiv
- **Lucide React** - Iconuri moderne și elegante
- **React Hook Form** - Gestionarea formularelor
- **Zod** - Validare schema

### Backend

- **Next.js API Routes** - Backend integrat
- **PostgreSQL** - Baza de date relațională
- **Prisma ORM** - Object-Relational Mapping
- **NextAuth.js** - Autentificare și sesiuni
- **bcryptjs** - Hashing parole securizat

### Servicii Externe

- **Tesseract.js** - Optical Character Recognition (OCR)
- **Spoonacular API** - Baza de date de rețete
- **USDA Food API** - Date nutriționale (opțional)
- **Sharp** - Procesarea imaginilor

## 🚀 Instalare și Configurare

### Cerințe Preliminare

- Node.js 18.0.0 sau mai nou
- PostgreSQL 12 sau mai nou
- npm, yarn, pnpm sau bun

### 1. Instalarea Dependințelor

```bash
npm install
```

### 2. Configurarea Bazei de Date

#### Instalarea PostgreSQL

```bash
# Windows (cu Chocolatey)
choco install postgresql

# macOS (cu Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

#### Crearea Bazei de Date

```sql
CREATE DATABASE weight_loss_app;
CREATE USER weight_loss_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE weight_loss_app TO weight_loss_user;
```

### 3. Configurarea Variabilelor de Mediu

Copiază `.env.example` în `.env.local` și completează variabilele:

```bash
cp .env.example .env.local
```

Editează `.env.local`:

```env
# Database
DATABASE_URL="postgresql://weight_loss_user:your_password@localhost:5432/weight_loss_app?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# API Keys (opționale)
SPOONACULAR_API_KEY="your-spoonacular-api-key"
USDA_API_KEY="your-usda-api-key"
```

### 4. Migrarea Bazei de Date

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Rularea Aplicației

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`

## 🔐 Obținerea API Keys

### Spoonacular API

1. Creează cont pe [Spoonacular API](https://spoonacular.com/food-api)
2. Obții API key gratuit (150 cereri/zi)
3. Adaugă key-ul în `.env.local`

## 📱 Funcționalități Detaliate

### Scanarea Produselor

- Suportă formatele: PNG, JPG, JPEG, GIF, BMP, WebP
- Dimensiune maximă: 5MB
- Procesare automată cu OCR pentru extragerea textului
- Identificare automată a valorilor nutriționale

### Calcularea Caloriilor

- Ecuația Harris-Benedict pentru metabolismul basal
- Ajustări pentru nivelul de activitate fizică
- Deficit caloric automat pentru pierderea în greutate

## 🚀 Deploy în Producție

### Vercel (Recomandat)

```bash
# Instalează Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway (Pentru baza de date)

1. Creează cont pe [Railway](https://railway.app)
2. Creează serviciu PostgreSQL
3. Copiază DATABASE_URL în variabilele de mediu
