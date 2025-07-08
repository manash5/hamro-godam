import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Compare password (assuming user.password is hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true, id: user._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ exists: false, error: 'Server error' }, { status: 500 });
  }
}