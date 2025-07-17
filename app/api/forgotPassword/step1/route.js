import OtpSchema from "@/components/model/changePass";
import { NextResponse } from "next/server";
import ConnectDB from "@/components/connectDB";

export async function POST(req) {
  try {
    console.log("📥 Received request on /api/forgotPassword/step1");

    // ⚠️ yahan await bhool gaye the
    const body = await req.json();
    console.log("✅ Parsed request body:", body);

    const { email, otp } = body;
    if (!email || !otp) {
      console.error("❌ Email or OTP missing in request body");
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    console.log("🔗 Connecting to database...");
    await ConnectDB();
    console.log("✅ Connected to Database Successfully");

    console.log("🔍 Verifying code in DB for email:", email, " and otp:", otp);
    const findcode = await OtpSchema.findOne({ email, code: otp });

    if (!findcode) {
      console.error("❌ Invalid OTP for email:", email);
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    console.log("✅ OTP verified successfully in DB");
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully!!!"
    });

  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
