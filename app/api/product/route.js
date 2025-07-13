import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Product } from '@/models/product/product';

// POST create new product
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDB();

    const newProduct = new Product({
      name: body.name,
      description: body.description,
      stock: body.stock,
        price: body.price,
        category: body.category,
      // add other fields as needed
    });

    await newProduct.save();

    return NextResponse.json(
      { data: newProduct, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}