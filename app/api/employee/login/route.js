import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Employee } from '@/models/employee/employee';
import { generateToken } from '@/utils/token';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectToDB();
    const employee = await Employee.findOne({ email });
    if (!employee || employee.password !== password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    const token = generateToken({ employeeId: employee._id });
    return NextResponse.json({ token, employeeId: employee._id, message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
} 