import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/token';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectToDB();

    const user = await User.findOne({ email });
    console.log(user); 
    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Compare password (assuming user.password is hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const accessToken = generateToken({user: user.toJSON()})

    return NextResponse.json({ exists: true, id: user._id, token: accessToken }, { status: 200 });
  } catch (error) {
    console.log(error); 
    return NextResponse.json({ exists: false, error: 'Server error' }, { status: 500 });
  }
}