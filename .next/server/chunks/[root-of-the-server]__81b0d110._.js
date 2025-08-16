module.exports = {

"[project]/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Import funcțiile de detectare din natural-chat
function detectFoodsInMessage(message) {
    const foods = [];
    const messageClean = message.toLowerCase();
    // Pattern-uri mai naturale pentru alimente românești
    const foodPatterns = [
        // Pâine și cereale
        {
            pattern: /(\d+)\s*(felii?|felie)\s*(de\s+)?pâine/gi,
            food: "pâine",
            unit: "felie",
            calsPerUnit: 80
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?pâine/gi,
            food: "pâine",
            unit: "g",
            calsPerGram: 2.5
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(orez|rice)/gi,
            food: "orez fiert",
            unit: "g",
            calsPerGram: 1.3
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(paste|spaghete|macaroane)/gi,
            food: "paste",
            unit: "g",
            calsPerGram: 1.1
        },
        // Proteine
        {
            pattern: /(\d+)\s*(ouă?|ou)/gi,
            food: "ouă",
            unit: "bucată",
            calsPerUnit: 70
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(pui|piept\s*de\s*pui)/gi,
            food: "piept de pui",
            unit: "g",
            calsPerGram: 1.65
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(peşte|peste|somon|ton)/gi,
            food: "pește",
            unit: "g",
            calsPerGram: 1.2
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(carne|vita|porc)/gi,
            food: "carne",
            unit: "g",
            calsPerGram: 2.5
        },
        // Lactate
        {
            pattern: /(\d+)\s*ml?\s*(de\s+)?lapte/gi,
            food: "lapte",
            unit: "ml",
            calsPerMl: 0.64
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(brânză|caş|telemea)/gi,
            food: "brânză",
            unit: "g",
            calsPerGram: 2.8
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?iaurt/gi,
            food: "iaurt",
            unit: "g",
            calsPerGram: 0.6
        },
        // Fructe și legume
        {
            pattern: /(\d+)\s*(mere?|măr)/gi,
            food: "măr",
            unit: "bucată",
            calsPerUnit: 80
        },
        {
            pattern: /(\d+)\s*banane?/gi,
            food: "banană",
            unit: "bucată",
            calsPerUnit: 90
        },
        {
            pattern: /(\d+)\s*portocale?/gi,
            food: "portocală",
            unit: "bucată",
            calsPerUnit: 60
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(roşii|tomate)/gi,
            food: "roșii",
            unit: "g",
            calsPerGram: 0.18
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(salată|verdeţuri)/gi,
            food: "salată verde",
            unit: "g",
            calsPerGram: 0.15
        },
        // Snacksuri și dulciuri
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(ciocolată|chocolate)/gi,
            food: "ciocolată",
            unit: "g",
            calsPerGram: 5.5
        },
        {
            pattern: /(\d+)\s*g?\s*(de\s+)?(biscuiţi|fursecuri)/gi,
            food: "biscuiți",
            unit: "g",
            calsPerGram: 4.5
        }
    ];
    for (const { pattern, food, unit, calsPerUnit, calsPerGram, calsPerMl } of foodPatterns){
        const matches = Array.from(message.matchAll(pattern));
        for (const match of matches){
            const quantity = parseInt(match[1]);
            if (isNaN(quantity) || quantity <= 0) continue;
            let totalCalories = 0;
            let displayText = "";
            if (calsPerUnit) {
                totalCalories = quantity * calsPerUnit;
                displayText = `${quantity} ${unit}${quantity > 1 ? unit === "bucată" ? " bucăți" : "i" : ""} ${food}`;
            } else if (calsPerGram) {
                totalCalories = quantity * calsPerGram;
                displayText = `${quantity}g ${food}`;
            } else if (calsPerMl) {
                totalCalories = quantity * calsPerMl;
                displayText = `${quantity}ml ${food}`;
            }
            foods.push({
                name: displayText,
                calories: Math.round(totalCalories),
                baseFood: food,
                quantity,
                unit
            });
        }
    }
    return foods;
}
function estimateMacros(foodName, calories) {
    const foodType = foodName.toLowerCase();
    // Estimări bazate pe tipul de aliment
    if (foodType.includes("pui") || foodType.includes("peşte") || foodType.includes("ou")) {
        // Proteine
        return {
            protein: Math.round(calories * 0.6 / 4),
            carbs: Math.round(calories * 0.1 / 4),
            fat: Math.round(calories * 0.3 / 9)
        };
    } else if (foodType.includes("pâine") || foodType.includes("orez") || foodType.includes("paste")) {
        // Carbohidrați
        return {
            protein: Math.round(calories * 0.15 / 4),
            carbs: Math.round(calories * 0.7 / 4),
            fat: Math.round(calories * 0.15 / 9)
        };
    } else if (foodType.includes("brânză") || foodType.includes("lapte") || foodType.includes("iaurt")) {
        // Lactate
        return {
            protein: Math.round(calories * 0.35 / 4),
            carbs: Math.round(calories * 0.35 / 4),
            fat: Math.round(calories * 0.3 / 9)
        };
    } else {
        // General/fructe/legume
        return {
            protein: Math.round(calories * 0.1 / 4),
            carbs: Math.round(calories * 0.8 / 4),
            fat: Math.round(calories * 0.1 / 9)
        };
    }
}
function getCurrentMealTime() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
        return "dimineata";
    } else if (hour >= 12 && hour < 18) {
        return "amiaza";
    } else {
        return "seara";
    }
}
// Funcție pentru apelul către Perplexity API cu fetch direct
async function callPerplexityAPI(message) {
    console.log("PERPLEXITY_API_KEY:", process.env.PERPLEXITY_API_KEY ? "SET" : "NOT SET");
    console.log("Token length:", process.env.PERPLEXITY_API_KEY?.length || 0);
    if (!process.env.PERPLEXITY_API_KEY) {
        return "Îmi pare rău, nu am acces la serviciul AI momentan. Te rog să verifici configurația.";
    }
    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: "Ești un coach personal de nutriție profesional și expert în română. Vorbești profesional și prietenos, ești motivant dar echilibrat, dai sfaturi practice și bazate pe știință, ești empatic și înțelegător."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });
        if (!response.ok) {
            console.error("Perplexity API error:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            return "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou! 😔";
        }
        const data = await response.json();
        return data.choices[0]?.message?.content || "Nu am putut genera un răspuns.";
    } catch (error) {
        console.error("GitHub AI API error:", error);
        return "Îmi pare rău, am o problemă tehnică. Te rog încearcă din nou! 😔";
    }
}
async function POST(request) {
    try {
        const { message } = await request.json();
        if (!message?.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Message is required"
            }, {
                status: 400
            });
        }
        // Apelează Perplexity AI
        const aiResponse = await callPerplexityAPI(message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response: aiResponse,
            success: true
        });
    } catch (error) {
        console.error("Error in chat:", error);
        // Fallback răspuns dacă AI nu funcționează
        const fallbackResponses = [
            "Îmi pare rău, am o problemă tehnică momentan. Pot să te ajut cu ceva simplu despre nutriție? 🍎",
            "Nu reușesc să mă conectez la serviciul AI acum. Ce întrebare ai despre alimentația sănătoasă? 🥗",
            "Am o mică problemă tehnică. Spune-mi ce vrei să știi despre dietă și îți răspund! 💪"
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            success: false
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__81b0d110._.js.map