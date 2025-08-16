# Copilot Instructions pentru Aplicația de Slăbire

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Context Aplicație

Aceasta este o aplicație web completă pentru ajutarea la slăbire, construită cu:

- **Frontend**: Next.js 14+ cu TypeScript și TailwindCSS
- **Backend**: API Routes în Next.js
- **Baza de date**: PostgreSQL cu Prisma ORM
- **Autentificare**: NextAuth.js cu JWT
- **OCR**: Tesseract.js pentru scanarea etichetelor alimentare
- **API-uri externe**: Spoonacular pentru rețete, USDA pentru date nutriționale

## Funcționalități Principale

1. **Scanare eticheте alimentare** - OCR pentru extragerea informațiilor nutriționale
2. **Jurnal alimentar zilnic** - Tracking calorii și macronutrienți
3. **Sugestii rețete personalizate** - În funcție de caloriile rămase
4. **Autentificare utilizatori** - Profil personal cu obiective
5. **UI responsiv** - Design modern cu TailwindCSS

## Instrucțiuni pentru Cod

- Folosește TypeScript strict pentru type safety
- Implementează error handling complet
- Creează componente reutilizabile și modulare
- Respectă principiile clean code și separation of concerns
- Documentează toate API endpoints-urile
- Folosește Prisma pentru operațiile de bază de date
- Implementează validare tanto pe frontend cât și pe backend
