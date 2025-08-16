import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutrition Coach - AI Personal pentru Nutriție",
  description:
    "Asistentul tău personal pentru o alimentație sănătoasă cu AI conversațional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
