import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Order } from '@/models/order/order';


export async function GET() {
  try {
    await connectToDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDB();

    const newOrder = new Order({
      customerName: body.customerName,
      customerNumber: body.customerNumber,
      customerAddress: body.customerAddress,
      productName: body.productName,    
      productQuantity: body.productQuantity,
      totalAmount: body.totalAmount,    
      status: body.status,               
      deliveryDate: body.deliveryDate,   
      payment: body.paymentMethod || body.payment, // <-- Ensures payment is always set
    });

    await newOrder.save();

    return NextResponse.json(
      { data: newOrder, message: 'Order created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
