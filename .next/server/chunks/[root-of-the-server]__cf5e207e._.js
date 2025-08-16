module.exports = {

"[project]/.next-internal/server/app/api/food-analytics/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[externals]/buffer [external] (buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/app/api/food-analytics/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
;
;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
async function GET(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Nu ești autentificat"
            }, {
                status: 401
            });
        }
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("start");
        const endDate = searchParams.get("end");
        if (!startDate || !endDate) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Datele de început și sfârșit sunt necesare"
            }, {
                status: 400
            });
        }
        // Pentru demo, vom simula date
        const mockEntries = [
            {
                id: "1",
                food_name: "Ouă mici cu bacon",
                calories: 320,
                protein: 25,
                carbs: 5,
                fat: 22,
                meal_time: "dimineata",
                date: "2025-08-01",
                created_at: new Date().toISOString(),
                user_id: decoded.userId
            },
            {
                id: "2",
                food_name: "Salată de pui cu avocado",
                calories: 450,
                protein: 35,
                carbs: 15,
                fat: 28,
                meal_time: "amiaza",
                date: "2025-08-01",
                created_at: new Date().toISOString(),
                user_id: decoded.userId
            },
            {
                id: "3",
                food_name: "Somon la grătar cu broccoli",
                calories: 380,
                protein: 40,
                carbs: 12,
                fat: 18,
                meal_time: "seara",
                date: "2025-08-01",
                created_at: new Date().toISOString(),
                user_id: decoded.userId
            }
        ];
        const entries = mockEntries;
        if (entries.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                analysis: null
            });
        }
        // Calculează statisticile
        const totalEntries = entries.length;
        const totalCalories = entries.reduce((sum, entry)=>sum + entry.calories, 0);
        const totalProtein = entries.reduce((sum, entry)=>sum + entry.protein, 0);
        const totalCarbs = entries.reduce((sum, entry)=>sum + entry.carbs, 0);
        const totalFat = entries.reduce((sum, entry)=>sum + entry.fat, 0);
        const avgCalories = totalCalories / totalEntries;
        const avgProtein = totalProtein / totalEntries;
        const avgCarbs = totalCarbs / totalEntries;
        const avgFat = totalFat / totalEntries;
        // Calculează distribuția macronutrienților
        const totalMacros = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;
        const proteinPercent = totalProtein * 4 / totalMacros * 100;
        const carbsPercent = totalCarbs * 4 / totalMacros * 100;
        const fatPercent = totalFat * 9 / totalMacros * 100;
        // Găsește masa preferată
        const mealTimes = entries.reduce((acc, entry)=>{
            acc[entry.meal_time] = (acc[entry.meal_time] || 0) + 1;
            return acc;
        }, {});
        const favoriteTime = Object.keys(mealTimes).reduce((a, b)=>mealTimes[a] > mealTimes[b] ? a : b);
        // Top alimente
        const foodCounts = entries.reduce((acc, entry)=>{
            const foodName = entry.food_name.toLowerCase();
            if (!acc[foodName]) {
                acc[foodName] = {
                    name: entry.food_name,
                    count: 0,
                    totalCalories: 0
                };
            }
            acc[foodName].count++;
            acc[foodName].totalCalories += entry.calories;
            return acc;
        }, {});
        const topFoods = Object.values(foodCounts).map((food)=>({
                name: food.name,
                count: food.count,
                calories: Math.round(food.totalCalories / food.count)
            })).sort((a, b)=>b.count - a.count);
        // Analiză dietă
        let dietAnalysis = "";
        if (proteinPercent > 30) {
            dietAnalysis = "Dieta ta este bogată în proteine, ceea ce este excelent pentru menținerea masei musculare și sațietate. ";
        } else if (proteinPercent < 15) {
            dietAnalysis = "Aportul tău de proteine este scăzut. Încearcă să incluzi mai multe surse de proteine în dietă. ";
        } else {
            dietAnalysis = "Aportul tău de proteine este în limitele normale. ";
        }
        if (carbsPercent > 60) {
            dietAnalysis += "Consumul de carbohidrați este ridicat - asigură-te că provind din surse complexe. ";
        } else if (carbsPercent < 30) {
            dietAnalysis += "Urmezi o dietă low-carb, ceea ce poate fi benefic pentru pierderea în greutate. ";
        }
        if (fatPercent > 40) {
            dietAnalysis += "Aportul de grăsimi este ridicat - încearcă să te concentrezi pe grăsimi sănătoase. ";
        }
        dietAnalysis += `Analizând datele tale recente, ai înregistrat ${totalEntries} mese cu o medie de ${Math.round(avgCalories)} calorii pe intrare. Preferințele tale alimentare arată o înclinație către alimente bogate în proteine, ceea ce este benefic pentru obiectivele de fitness.`;
        // Pattern săptămânal (simplificat)
        const weeklyPattern = entries.reduce((acc, entry)=>{
            const date = entry.date;
            acc[date] = (acc[date] || 0) + entry.calories;
            return acc;
        }, {});
        const analysis = {
            totalEntries,
            avgCalories: Math.round(avgCalories),
            avgProtein: Math.round(avgProtein * 10) / 10,
            avgCarbs: Math.round(avgCarbs * 10) / 10,
            avgFat: Math.round(avgFat * 10) / 10,
            favoriteTime,
            topFoods,
            macroDistribution: {
                protein: Math.round(proteinPercent),
                carbs: Math.round(carbsPercent),
                fat: Math.round(fatPercent)
            },
            dietAnalysis,
            weeklyPattern
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error("Eroare la încărcarea analizei:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Eroare la încărcarea analizei"
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__cf5e207e._.js.map