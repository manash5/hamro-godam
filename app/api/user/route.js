import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user'

// GET all users
export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return NextResponse.json({ 
      data: users, 
      message: "Successfully fetched users" 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body?.email || !body?.name || !body?.password) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    await connectToDB();
    const newUser = await User.create({
      name: body.name,
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

