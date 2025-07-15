import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Product } from '@/models/product/product';
import { verifyToken } from '@/utils/auth';

// POST create new product
export async function POST(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    const body = await request.json();
    await connectToDB();

    const newProduct = new Product({
      name: body.name,
      description: body.description,
      stock: body.stock,
        price: body.price,
        category: body.category,
      image: body.image, // Add image
      status: body.status, // Add status
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

// GET all products
export async function GET(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    await connectToDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ 
      data: products, 
      message: "Successfully fetched products" 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}