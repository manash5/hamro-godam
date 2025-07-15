import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Supplier } from '@/models/supplier/supplier';
import { verifyToken } from '@/utils/auth';

export async function GET(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    await connectToDB();
    const suppliers = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ data:suppliers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to supplier' }, { status: 500 });
  }
}

export async function POST(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    const body = await request.json();
    await connectToDB();

    const newSupplier = new Supplier({
      name: body.name,
      email: body.email,
      contact_number: body.contact_number,
      address: body.address,
      category: body.category,
      pan_number: body.pan_number,
      company_name: body.company_name,
    });

    await newSupplier.save();

    return NextResponse.json(
      { data: newSupplier, message: 'Supplier created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
