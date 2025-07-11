import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Employee } from '@/models/employee/employee';

// GET employee by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(
      { data: employee, message: 'Employee fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

// PATCH update employee by ID
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    employee.name = body.name ?? employee.name;
    employee.email = body.email ?? employee.email;
    employee.contact_number = body.contact_number ?? employee.contact_number;
    employee.address = body.address ?? employee.address;
    employee.password = body.password ?? employee.password;

    await employee.save();

    return NextResponse.json(
      { data: employee, message: 'Employee updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE employee by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
