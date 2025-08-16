import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json();

    console.log("Testing signup with:", { email, full_name });

    const supabase = await createSupabaseServerClient();

    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error,
          message: `Signup failed: ${error.message}`,
        },
        { status: 400 }
      );
    }

    // Check user data
    const userInfo = {
      id: data.user?.id,
      email: data.user?.email,
      confirmed_at: data.user?.email_confirmed_at,
      created_at: data.user?.created_at,
      user_metadata: data.user?.user_metadata,
      session: data.session ? "Session created" : "No session",
    };

    return NextResponse.json({
      success: true,
      message: "Signup successful!",
      user: userInfo,
      needsConfirmation: !data.user?.email_confirmed_at,
      instructions: !data.user?.email_confirmed_at
        ? "Check your email for confirmation link"
        : "User can login immediately",
    });
  } catch (error) {
    console.error("Test signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Technical error",
      },
      { status: 500 }
    );
  }
}
