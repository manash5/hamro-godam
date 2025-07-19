import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Order } from '@/models/order/order';
import { Product } from '@/models/product/product';

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

    // Handle stock updates for product changes
    if (body.productIds && body.productIds.length > 0) {
      // First, restore the old stock from the current order
      if (order.productName && order.productName.length > 0) {
        for (let i = 0; i < order.productName.length; i++) {
          const productName = order.productName[i];
          const oldQuantity = order.productQuantity[i];
          
          // Find product by name (since we don't store product IDs in old orders)
          const product = await Product.findOne({ name: productName });
          if (product) {
            await Product.findByIdAndUpdate(
              product._id,
              { $inc: { stock: oldQuantity } }
            );
          }
        }
      }

      // Validate stock availability for new products
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

      // Subtract new stock
      for (let i = 0; i < body.productIds.length; i++) {
        const productId = body.productIds[i];
        const quantity = body.productQuantity[i];
        
        await Product.findByIdAndUpdate(
          productId,
          { $inc: { stock: -quantity } }
        );
      }
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
    order.deliveryBy = body.deliveryBy ?? order.deliveryBy;

    await order.save();

    return NextResponse.json(
      { data: order, message: 'Order updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Restore stock when order is deleted
    if (order.productName && order.productName.length > 0) {
      for (let i = 0; i < order.productName.length; i++) {
        const productName = order.productName[i];
        const quantity = order.productQuantity[i];
        
        // Find product by name and restore stock
        const product = await Product.findOne({ name: productName });
        if (product) {
          await Product.findByIdAndUpdate(
            product._id,
            { $inc: { stock: quantity } }
          );
        }
      }
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Order deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
