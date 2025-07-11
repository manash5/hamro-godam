import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Supplier } from '@/models/supplier/supplier';

// GET supplier by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json(
      { data: supplier, message: 'Supplier fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

// PATCH update supplier
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }

    supplier.name = body.name ?? supplier.name;
    supplier.email = body.email ?? supplier.email;
    supplier.contact_number = body.contact_number ?? supplier.contact_number;
    supplier.address = body.address ?? supplier.address;
    supplier.company_name = body.company_name ?? supplier.company_name;

    await supplier.save();

    return NextResponse.json(
      { data: supplier, message: 'Supplier updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}

// DELETE supplier
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Supplier deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
