import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Employee } from '@/models/employee/employee';
import { verifyToken } from '@/utils/auth';

// POST create new employee
export async function POST(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    const body = await request.json();
    await connectToDB();

    const newEmployee = new Employee({
      name: body.name,
      email: body.email,
      contact_number: body.contact_number,
      address: body.address,
      password: body.password,
      salary: body.salary, 
      // add other fields as needed
    });

    await newEmployee.save();

    return NextResponse.json(
      { data: newEmployee, message: 'Employee created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

// GET all employees
export async function GET(request) {
  try {
    await connectToDB();
    const employees = await Employee.find();
    return NextResponse.json({ data: employees, message: 'Employees fetched successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}
