import ConnectDB from "@/components/connectDB";
import bcrypt from "bcrypt";
import otpCode from "@/components/model/codeSchema";
import { cookies } from "next/headers";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";   // ✅ better than Response.json directly

export async function POST(req) {
    try {
        await ConnectDB();
        console.log("✅ Connected to DB successfully");

        const body = await req.json();
        const { email, password } = body;
        console.log("📦 Received body:", body);

        if (!email || !password) {
            console.error("❌ Email and Password fields are required");
            return NextResponse.json({ error: "Email and Password fields are required" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Password hashed");

        // Generate verification code
        const code = crypto.randomInt(100000, 999999).toString();
        console.log("✅ OTP generated:", code);

        // Save OTP to DB
        await otpCode.create({ email, code });
        console.log("✅ OTP saved to DB");

        // Send mail
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            port: 587,
            secure: false,
            auth: {
                user: process.env.User_ID,
                pass: process.env.User_PASS, // ✅ fix spelling from USer_PASS → User_PASS
            },
        });
        console.log("📧 Mail transporter created");

        await transporter.sendMail({
            from: `"Ch Arham" <${process.env.User_ID}>`,
            to: email,
            subject: "Your Verification Code - Ch Arham",
            html: `
    <div style="
      max-width: 480px;
      margin: auto;
      font-family: Arial, sans-serif;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      color: #333;
    ">
      <h2 style="text-align: center; color: #0d6efd; margin-bottom: 20px;">
        🔐 Ch Arham Verification
      </h2>
      <p style="font-size: 16px; margin-bottom: 16px;">
        Hello,
      </p>
      <p style="font-size: 16px; margin-bottom: 16px;">
        Use the following OTP code to verify your account:
      </p>
      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        text-align: center;
        margin: 20px 0;
        color: #0d6efd;
      ">
        ${code}
      </div>
      <p style="font-size: 14px; color: #555; margin-top: 24px;">
        If you did not request this code, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #555; margin-top: 8px;">
        This code will expire in 10 minutes.
      </p>
      <p style="font-size: 14px; color: #999; margin-top: 24px; text-align: center;">
        &copy; 2025 Ch Arham. All rights reserved.
      </p>
    </div>
      `,
        });
        console.log("✅ OTP mail sent to user");

        // Set cookies (with JSON stringified values)
        const cookieStore = await cookies();
        cookieStore.set("verify_signup_email", JSON.stringify(email), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 60, // 10 minutes
            path: "/api/signup",       // ✅ usually just '/' is enough
        });
        cookieStore.set("verify_signup_password", JSON.stringify(hashedPassword), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 60,
            path: "/api/signup",
        });
        console.log("🍪 Cookies set successfully");

        return NextResponse.json({ message: "OTP sent & cookie set successfully!" });

    } catch (err) {
        console.error("❌ Error occurred:", err);
        return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
    }
}
