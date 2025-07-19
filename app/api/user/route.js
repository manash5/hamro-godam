import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user';

// GET all users
export async function GET() {
  try {
    await connectToDB();
    const users = await User.find().select('-password'); // Hide password
    return NextResponse.json(
      { data: users, message: "Successfully fetched users" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
    const { email, FirstName, LastName, password } = body;

    if (!email || !FirstName || !LastName || !password) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      FirstName,
      LastName,
      email,
      password: hashedPassword
    });

    const userResponse = { ...newUser._doc };
    delete userResponse.password;

    return NextResponse.json(
      { data: userResponse, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
