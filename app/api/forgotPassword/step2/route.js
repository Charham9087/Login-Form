import loginUser from "@/components/model/Schema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import ConnectDB from "@/components/connectDB";

export async function POST(req) {
  try {
    console.log("📥 Received request to update password");

    const body = await req.json();
    console.log("✅ Parsed request body:", body);

    const { password } = body;

    if (!password) {
      console.error("❌ Password not provided in request body");
      throw new Error("Password is required");
    }

    console.log("🍪 Reading email from cookies...");
    const cookieStore = cookies();
    const email = cookieStore.get("change_password_email")?.value;

    if (!email) {
      console.error("❌ Email not found in cookies");
      throw new Error("Email not found in cookies");
    }
    console.log("✅ Found email in cookies:", email);

    console.log("🔗 Connecting to database...");
    await ConnectDB();
    console.log("✅ Connected to database successfully");

    console.log("🔒 Hashing new password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed:", hashedPassword.slice(0, 10) + "...");

    console.log("📝 Updating password in database for user:", email);
    const updatedUser = await loginUser.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    if (!updatedUser) {
      console.error("❌ User not found in database to update password");
      throw new Error("User not found in database to update password");
    }

    console.log("✅ Password updated successfully for user:", email);

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("❌ Error changing password:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}
