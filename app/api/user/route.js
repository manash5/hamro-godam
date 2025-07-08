// app/api/users/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/database';
import { User } from '@/lib/models/User';

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

// Dynamic route handlers (GET, PATCH, DELETE by ID)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: user, message: "User fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.name = body.name || user.name;
    user.email = body.email || user.email;
    user.password = body.password || user.password;
    await user.save();

    return NextResponse.json(
      { data: user, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}