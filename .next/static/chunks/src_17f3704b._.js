(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createSupabaseClient": ()=>createSupabaseClient
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
// Temporar hardcodat pentru testare
const supabaseUrl = "https://qbjfxprdlssozwylctrt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiamZ4cHJkbHNzb3p3eWxjdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTU0NzEsImV4cCI6MjA2OTczMTQ3MX0.CwqHvxdcNdfS_wI_eXz7IHG1J_PBRgox8XSamZP8HHg";
const createSupabaseClient = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": ()=>AuthProvider,
    "useAuth": ()=>useAuth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function AuthProvider(param) {
    let { children } = param;
    _s1();
    console.log("AuthProvider component rendered - BEFORE EVERYTHING");
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Create supabase client instance
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSupabaseClient"])();
    console.log("AuthProvider - after useState, loading:", loading);
    // Get initial session and set up auth listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            console.log("USEEFFECT IS RUNNING!!!");
            // Get initial session
            const getInitialSession = {
                "AuthProvider.useEffect.getInitialSession": async ()=>{
                    try {
                        const { data: { session } } = await supabase.auth.getSession();
                        console.log("Initial session:", session);
                        var _session_user;
                        setUser((_session_user = session === null || session === void 0 ? void 0 : session.user) !== null && _session_user !== void 0 ? _session_user : null);
                    } catch (error) {
                        console.error("Error getting initial session:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.getInitialSession"];
            getInitialSession();
            // Set up auth state listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": async (event, session)=>{
                    var _session_user;
                    console.log("Auth state changed:", event, session === null || session === void 0 ? void 0 : (_session_user = session.user) === null || _session_user === void 0 ? void 0 : _session_user.email);
                    var _session_user1;
                    setUser((_session_user1 = session === null || session === void 0 ? void 0 : session.user) !== null && _session_user1 !== void 0 ? _session_user1 : null);
                    setLoading(false);
                }
            }["AuthProvider.useEffect"]);
            // Cleanup subscription
            return ({
                "AuthProvider.useEffect": ()=>subscription.unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        supabase.auth
    ]);
    console.log("AuthProvider - after useEffect definition");
    const signIn = async (email, password)=>{
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                console.error("Sign in error:", error);
                if (error.message.includes("email_not_confirmed")) {
                    return {
                        error: "Te rugăm să confirmi email-ul înainte de a te loga. Verifică inbox-ul pentru linkul de confirmare."
                    };
                }
                if (error.message.includes("invalid_credentials")) {
                    return {
                        error: "Email sau parolă incorectă. Verifică datele și încearcă din nou."
                    };
                }
                return {
                    error: error.message
                };
            }
            return {};
        } catch (error) {
            console.error("Sign in error:", error);
            return {
                error: "A apărut o eroare la conectare"
            };
        }
    };
    const signUp = async (email, password, fullName)=>{
        try {
            console.log("Starting signup process for:", email);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });
            if (error) {
                console.error("Supabase auth signup error:", error);
                if (error.message.includes("email_address_invalid")) {
                    return {
                        error: "Te rugăm să folosești o adresă de email validă (ex: nume@gmail.com)"
                    };
                }
                return {
                    error: error.message
                };
            }
            console.log("Auth signup successful:", data);
            // Nu mai creez profilul aici - se va crea automat când utilizatorul se loghează
            // Acest lucru evită problemele cu RLS și email confirmation
            if (data.user && !data.user.email_confirmed_at) {
                console.log("User created but needs email confirmation");
                return {
                    error: "Un email de confirmare a fost trimis la ".concat(email, ". Te rugăm să deschizi linkul din email pentru a-ți activa contul.")
                };
            }
            console.log("Signup completed successfully");
            return {};
        } catch (error) {
            console.error("Sign up error:", error);
            return {
                error: "A apărut o eroare la înregistrare"
            };
        }
    };
    const signOut = async ()=>{
        await supabase.auth.signOut();
    };
    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 167,
        columnNumber: 10
    }, this);
}
_s1(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_17f3704b._.js.map