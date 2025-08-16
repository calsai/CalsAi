(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

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
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    console.log("AuthProvider - after useState, loading:", loading);
    // SIMPLEST POSSIBLE USEEFFECT
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            console.log("USEEFFECT IS RUNNING!!!");
            setTimeout({
                "AuthProvider.useEffect": ()=>{
                    console.log("USEEFFECT TIMEOUT - setting loading to false");
                    setLoading(false);
                }
            }["AuthProvider.useEffect"], 1000);
        }
    }["AuthProvider.useEffect"], []);
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
        lineNumber: 139,
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

//# sourceMappingURL=src_contexts_AuthContext_tsx_fbc75c35._.js.map