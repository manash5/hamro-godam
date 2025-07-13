import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Order } from '@/models/order/order';

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
