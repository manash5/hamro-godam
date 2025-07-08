import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body?.email || !body?.FirstName || !body?.LastName || !body?.password) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    await connectToDB();
    const newUser = await User.create({
      FirstName: body.FirstName,
      LastName: body.LastName,
      email: body.email,
      password: body.password
    });

    return NextResponse.json(
      { data: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}