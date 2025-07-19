import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Order } from '@/models/order/order';
import { Product } from '@/models/product/product';
import { verifyToken } from '@/utils/auth';

export async function GET(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }
  try {
    await connectToDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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

    // Validate stock availability before creating order
    if (body.productIds && body.productIds.length > 0) {
      for (let i = 0; i < body.productIds.length; i++) {
        const productId = body.productIds[i];
        const quantity = body.productQuantity[i];
        
        const product = await Product.findById(productId);
        if (!product) {
          return NextResponse.json({ 
            error: `Product not found: ${body.productName[i]}` 
          }, { status: 400 });
        }
        
        if (product.stock < quantity) {
          return NextResponse.json({ 
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}` 
          }, { status: 400 });
        }
      }
    }

    const newOrder = new Order({
      customerName: body.customerName,
      customerNumber: body.customerNumber,
      customerAddress: body.customerAddress,
      productName: body.productName,    
      productQuantity: body.productQuantity,
      totalAmount: body.totalAmount,    
      status: body.status,               
      deliveryDate: body.deliveryDate,   
      payment: body.paymentMethod || body.payment,
      deliveryBy: body.deliveryBy || 'ram hari',
    });

    await newOrder.save();

    // Update product stock after order is created
    if (body.productIds && body.productIds.length > 0) {
      for (let i = 0; i < body.productIds.length; i++) {
        const productId = body.productIds[i];
        const quantity = body.productQuantity[i];
        
        await Product.findByIdAndUpdate(
          productId,
          { $inc: { stock: -quantity } }
        );
      }
    }

    return NextResponse.json(
      { data: newOrder, message: 'Order created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
