import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { action, email, name, userId } = await request.json();

    if (action === "login") {
      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }

      // Încearcă să găsească utilizatorul existent
      let user = await db.getUserByEmail(email);

      // Dacă nu există, creează unul nou
      if (!user) {
        const userName = name || email.split("@")[0];
        user = await db.createUser(email, userName);
      }

      return NextResponse.json({
        success: true,
        user,
        message: "Conectare reușită",
      });
    }

    if (action === "get") {
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const user = await db.getUser(userId);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in user management:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Technical error",
      },
      { status: 500 }
    );
  }
}
