// app/api/login/route.js
import loginUser from "@/components/model/Schema";
import ConnectDB from "@/components/connectDB";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await ConnectDB();

    if (!email || !password) {
      throw new Error('Email and Password are Required');
    }

    // find user by email only
    const user = await loginUser.findOne({ email });
    if (!user) {
      throw new Error('User not found❌');
    }

    // compare password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password❌');
    }

    return NextResponse.json({ message: 'Successfully logged in✅', user }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error.message);

    if (error.message === 'Email and Password are Required') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.message === 'User not found❌' || error.message === 'Incorrect password❌') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
