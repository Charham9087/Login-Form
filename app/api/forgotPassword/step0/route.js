import OtpSchema from "@/components/model/changePass";
import { NextResponse } from "next/server";
import ConnectDB from "@/components/connectDB";
import loginUser from "@/components/model/Schema";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    console.log("✅ Received request on /api/forgotPassword/step0");

    const body = await req.json();
    console.log("✅ Parsed request body:", body);

    const { email } = body;
    if (!email) {
      console.error("❌ Email not provided in request body");
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    console.log(" Connecting to database...");
    await ConnectDB();
    console.log("✅ Connected to database successfully");

    console.log("🔍 Searching for user by email:", email);
    const foundEmail = await loginUser.findOne({ email });

    if (!foundEmail) {
      console.error("❌ User not found in DB with email:", email);
      return NextResponse.json({ success: false, message: "User not found. Please signup first." }, { status: 404 });
    }

    console.log("✅ User found. Generating OTP...");
    const code = crypto.randomInt(100000, 999999).toString();
    console.log("✅ Generated OTP:", code);

    console.log("✅ Saving OTP to DB...");
    await OtpSchema.deleteMany({ email });
    await OtpSchema.create({ email, code });
    console.log("✅ OTP saved to DB");

    console.log("📧 Creating transporter for nodemailer...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.User_ID,
        pass: process.env.User_PASS
      }
    });

    console.log("📧 Sending email to:", email);
    await transporter.sendMail({
      from: `"Ch Arham" <${process.env.User_ID}>`,
      to: email,
      subject: "Your Verification Code - Ch Arham",
      html: `
        <div style="max-width: 480px; margin: auto; font-family: Arial, sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; color: #333;">
          <h2 style="text-align: center; color: #0d6efd; margin-bottom: 20px;">
            🔐 Ch Arham Verification
          </h2>
          <p style="font-size: 16px; margin-bottom: 16px;">
            Use the following OTP code to verify your account:
          </p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 20px 0; color: #0d6efd;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #555; margin-top: 24px;">
            This code will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 24px; text-align: center;">
            &copy; 2025 Ch Arham. All rights reserved.
          </p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully to:", email);

    console.log("🍪 Setting cookies...");
    const cookieStore = await cookies();

    cookieStore.set("change_password_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60,
      path: "/api/forgotPassword"
    });

    cookieStore.set("change_password_code", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60,
      path: "/api/forgotPassword"
    });
    console.log("✅ Cookies set successfully");

    console.log("✅ All steps completed successfully. Sending response back to client.");
    return NextResponse.json({ success: true, message: "OTP sent to your Email successfully!" });

  } catch {
    if (Error.message = "User not found. Please signup first.")
      return NextResponse.json(Error.message);
  }
}
