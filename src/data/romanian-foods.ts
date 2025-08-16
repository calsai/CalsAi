// Baza de date cu alimente românești populare
export interface RomanianFood {
  id: string;
  name: string;
  category: string;
  calories: number; // per 100g
  protein: number; // per 100g
  carbs: number; // per 100g
  fat: number; // per 100g
  fiber?: number; // per 100g
  common_portions: {
    name: string;
    grams: number;
  }[];
  aliases: string[]; // nume alternative
}

export const romanianFoods: RomanianFood[] = [
  // Produse de panificație și cerealiere
  {
    id: "paine-alba",
    name: "Pâine albă",
    category: "Panificație",
    calories: 265,
    protein: 9,
    carbs: 49,
    fat: 3.2,
    fiber: 2.7,
    common_portions: [
      { name: "felie", grams: 30 },
      { name: "jumătate de pâine", grams: 250 },
      { name: "pâine întreagă", grams: 500 },
    ],
    aliases: ["paine", "franzela", "chifla"],
  },
  {
    id: "paine-graham",
    name: "Pâine Graham",
    category: "Panificație",
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 4.2,
    fiber: 7,
    common_portions: [
      { name: "felie", grams: 35 },
      { name: "toast", grams: 25 },
    ],
    aliases: ["paine graham", "paine integrala"],
  },

  // Carne și pește
  {
    id: "piept-pui",
    name: "Piept de pui",
    category: "Carne",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    common_portions: [
      { name: "piept mediu", grams: 150 },
      { name: "jumătate piept", grams: 75 },
      { name: "porție", grams: 120 },
    ],
    aliases: ["pui", "piept pui", "carne pui"],
  },
  {
    id: "carne-porc",
    name: "Carne de porc (cotlet)",
    category: "Carne",
    calories: 242,
    protein: 27,
    carbs: 0,
    fat: 14,
    fiber: 0,
    common_portions: [
      { name: "cotlet", grams: 100 },
      { name: "porție", grams: 150 },
    ],
    aliases: ["porc", "cotlet porc", "carne porc"],
  },
  {
    id: "carne-vita",
    name: "Carne de vită",
    category: "Carne",
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    fiber: 0,
    common_portions: [
      { name: "mușchi", grams: 150 },
      { name: "porție", grams: 120 },
    ],
    aliases: ["vita", "muschi vita", "carne tocata vita"],
  },
  {
    id: "crap",
    name: "Crap",
    category: "Pește",
    calories: 127,
    protein: 18,
    carbs: 0,
    fat: 5.6,
    fiber: 0,
    common_portions: [
      { name: "file", grams: 150 },
      { name: "porție", grams: 200 },
    ],
    aliases: ["peste crap", "file crap"],
  },

  // Lactate românești
  {
    id: "telemea",
    name: "Telemea de oaie",
    category: "Lactate",
    calories: 230,
    protein: 17,
    carbs: 2,
    fat: 17,
    fiber: 0,
    common_portions: [
      { name: "felie", grams: 30 },
      { name: "porție", grams: 50 },
      { name: "cuburi", grams: 100 },
    ],
    aliases: ["telemea", "branza telemea", "branza oaie"],
  },
  {
    id: "cascaval",
    name: "Cașcaval",
    category: "Lactate",
    calories: 374,
    protein: 25,
    carbs: 1.3,
    fat: 30,
    fiber: 0,
    common_portions: [
      { name: "felie", grams: 20 },
      { name: "porție", grams: 40 },
    ],
    aliases: ["cascaval", "branza cascaval"],
  },
  {
    id: "smantana",
    name: "Smântână",
    category: "Lactate",
    calories: 193,
    protein: 2.8,
    carbs: 3.4,
    fat: 20,
    fiber: 0,
    common_portions: [
      { name: "lingură", grams: 15 },
      { name: "lingurită", grams: 5 },
      { name: "porție", grams: 50 },
    ],
    aliases: ["smantana", "frisca"],
  },

  // Legume românești
  {
    id: "cartofi",
    name: "Cartofi",
    category: "Legume",
    calories: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    fiber: 2.2,
    common_portions: [
      { name: "cartof mediu", grams: 150 },
      { name: "cartof mic", grams: 100 },
      { name: "porție", grams: 200 },
    ],
    aliases: ["cartof", "cartofi fierti", "cartofi cuptor"],
  },
  {
    id: "varza",
    name: "Varză albă",
    category: "Legume",
    calories: 25,
    protein: 1.3,
    carbs: 6,
    fat: 0.1,
    fiber: 2.5,
    common_portions: [
      { name: "cană", grams: 90 },
      { name: "porție", grams: 150 },
    ],
    aliases: ["varza", "varza alba", "varza calita"],
  },
  {
    id: "ceapa",
    name: "Ceapă",
    category: "Legume",
    calories: 40,
    protein: 1.1,
    carbs: 9.3,
    fat: 0.1,
    fiber: 1.7,
    common_portions: [
      { name: "ceapă medie", grams: 110 },
      { name: "ceapă mică", grams: 70 },
    ],
    aliases: ["ceapa", "ceapa rosie", "ceapa alba"],
  },

  // Preparate românești tradiționale
  {
    id: "sarmale",
    name: "Sarmale",
    category: "Preparate tradiționale",
    calories: 180,
    protein: 8,
    carbs: 15,
    fat: 10,
    fiber: 2,
    common_portions: [
      { name: "sarma", grams: 100 },
      { name: "porție (3 sarmale)", grams: 300 },
    ],
    aliases: ["sarma", "sarmale varza", "sarmale vita"],
  },
  {
    id: "mici",
    name: "Mici",
    category: "Preparate tradiționale",
    calories: 300,
    protein: 15,
    carbs: 5,
    fat: 25,
    fiber: 0,
    common_portions: [
      { name: "mic", grams: 60 },
      { name: "porție (5 mici)", grams: 300 },
    ],
    aliases: ["mic", "mititei"],
  },
  {
    id: "papanasi",
    name: "Papanași",
    category: "Deserturi",
    calories: 350,
    protein: 8,
    carbs: 45,
    fat: 16,
    fiber: 1,
    common_portions: [
      { name: "porție", grams: 200 },
      { name: "papanaș", grams: 100 },
    ],
    aliases: ["papanasi", "papanas"],
  },

  // Cereale și paste
  {
    id: "orez",
    name: "Orez alb fiert",
    category: "Cereale",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    common_portions: [
      { name: "cană", grams: 195 },
      { name: "porție", grams: 150 },
      { name: "lingură", grams: 15 },
    ],
    aliases: ["orez", "orez fiert", "orez basmati"],
  },
  {
    id: "paste",
    name: "Paste făinoase",
    category: "Cereale",
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    fiber: 1.8,
    common_portions: [
      { name: "cană", grams: 140 },
      { name: "porție", grams: 100 },
    ],
    aliases: ["paste", "spaghetti", "macaroane", "penne"],
  },

  // Fructe românești
  {
    id: "mere",
    name: "Mere",
    category: "Fructe",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    common_portions: [
      { name: "măr mediu", grams: 180 },
      { name: "măr mic", grams: 140 },
    ],
    aliases: ["mar", "mere rosii", "mere verzi"],
  },
  {
    id: "prune",
    name: "Prune",
    category: "Fructe",
    calories: 46,
    protein: 0.7,
    carbs: 11,
    fat: 0.3,
    fiber: 1.4,
    common_portions: [
      { name: "prună", grams: 60 },
      { name: "cană", grams: 165 },
    ],
    aliases: ["pruna", "prune albastre"],
  },

  // Condimente și sosuri
  {
    id: "marar",
    name: "Mărar",
    category: "Condimente",
    calories: 43,
    protein: 3.5,
    carbs: 7,
    fat: 1.1,
    fiber: 2.1,
    common_portions: [
      { name: "lingurită", grams: 1 },
      { name: "lingură", grams: 3 },
    ],
    aliases: ["marar", "marar uscat", "marar proaspat"],
  },
  {
    id: "ardei-iute",
    name: "Ardei iute",
    category: "Condimente",
    calories: 40,
    protein: 1.9,
    carbs: 9,
    fat: 0.4,
    fiber: 1.5,
    common_portions: [
      { name: "ardei", grams: 15 },
      { name: "lingurită", grams: 2 },
    ],
    aliases: ["ardei iute", "chili", "iute"],
  },
];

// Funcție pentru căutarea alimentelor românești
export function searchRomanianFoods(query: string): RomanianFood[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) return [];

  return romanianFoods
    .filter((food) => {
      // Caută în numele alimentului
      if (food.name.toLowerCase().includes(searchTerm)) return true;

      // Caută în aliases
      if (
        food.aliases.some((alias) => alias.toLowerCase().includes(searchTerm))
      )
        return true;

      // Caută în categorie
      if (food.category.toLowerCase().includes(searchTerm)) return true;

      return false;
    })
    .slice(0, 10); // Limitează la 10 rezultate
}

// Funcție pentru obținerea unui aliment după ID
export function getRomanianFoodById(id: string): RomanianFood | undefined {
  return romanianFoods.find((food) => food.id === id);
}

// Funcție pentru obținerea alimentelor după categorie
export function getRomanianFoodsByCategory(category: string): RomanianFood[] {
  return romanianFoods.filter((food) => food.category === category);
}

// Lista categoriilor disponibile
export const foodCategories = [
  "Panificație",
  "Carne",
  "Pește",
  "Lactate",
  "Legume",
  "Preparate tradiționale",
  "Deserturi",
  "Cereale",
  "Fructe",
  "Condimente",
];
