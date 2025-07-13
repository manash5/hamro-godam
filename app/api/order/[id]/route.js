import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Order } from '@/models/order/order';

// GET order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { data: order, message: 'Order fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH update order
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update order fields
    order.status = body.status ?? order.status;
    order.payment = (body.paymentMethod || body.payment) ?? order.payment;
    order.totalAmount = body.totalAmount ?? order.totalAmount;
    order.deliveryDate = body.deliveryDate ?? order.deliveryDate;
    order.customerName = body.customerName ?? order.customerName;
    order.customerNumber = body.customerNumber ?? order.customerNumber;
    order.customerAddress = body.customerAddress ?? order.customerAddress;
    order.productName = body.productName ?? order.productName;
    order.productQuantity = body.productQuantity ?? order.productQuantity;

    await order.save();

    return NextResponse.json(
      { data: order, message: 'Order updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
