import otpCode from '@/components/model/codeSchema';
import loginUser from '@/components/model/Schema';
import ConnectDB from '@/components/connectDB';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      throw new Error('Code is required');
    }

    await ConnectDB();
    console.log('✅ Connected to DB successfully');

    // get email & password from cookies
    const cookieStore = cookies();
    const emailCookie = cookieStore.get('verify_signup_email');
    const passwordCookie = cookieStore.get('verify_signup_password');

    if (!emailCookie || !passwordCookie) {
      throw new Error('Verification cookies not found');
    }

    // parse email & password from cookie (because stored with JSON.stringify)
    const email = JSON.parse(emailCookie.value);
    const password = JSON.parse(passwordCookie.value);

    console.log('📦 Trying to verify code for email:', email);

    // find code in DB
    const verified = await otpCode.findOne({ email, code });

    if (verified) {
      // create user
      await loginUser.create({ email, password });
      console.log('✅ User created successfully');

      return NextResponse.json({ message: 'User verified & created successfully!' });
    } else {
      console.log('❌ Incorrect code');
      throw new Error('Code entered is incorrect');
    }

  } catch (error) {
    console.error('❌ Error occurred:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 400 });
  }
}
