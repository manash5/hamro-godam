import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Product } from '@/models/product/product';

// GET product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { data: product, message: 'Product fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PATCH update product by ID
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    product.id = body.id ?? product.id;
    product.name = body.name ?? product.name;
    product.description = body.description ?? product.description;
    product.stock = body.stock ?? product.stock;
    product.price = body.price ?? product.price;
    product.category = body.category ?? product.category;
    product.image = body.image ?? product.image; // Add image update
    product.status = body.status ?? product.status; // Add status update

    await product.save();

    return NextResponse.json(
      { data: product, message: 'Product updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
