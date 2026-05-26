import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Securely pull credentials from server-side environment variables,
    // protecting them from compiling into the client bundle.
    const secureEmail = process.env.ADMIN_EMAIL || "vermanick75@gmail.com";
    const securePassword = process.env.ADMIN_PASSWORD || "Gsoc@2024";

    if (email.trim().toLowerCase() === secureEmail.trim().toLowerCase() && password === securePassword) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Invalid credential combination." }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in POST /api/admin/login:", error);
    return NextResponse.json({ success: false, error: "Authentication server error." }, { status: 500 });
  }
}
