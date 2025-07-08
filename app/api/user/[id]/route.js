import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { User } from '@/models/user/user';

// GET user by ID
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

// PATCH update user by ID
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

    user.FirstName = body.FirstName || user.FirstName;
    user.LastName = body.LastName || user.LastName;
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

// DELETE user by ID
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