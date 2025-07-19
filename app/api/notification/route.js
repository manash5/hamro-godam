import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Notification } from '@/models/notification/notification';
import { Product } from '@/models/product/product';
import { verifyToken } from '@/utils/auth';

// GET - Fetch all notifications
export async function GET(request) {
  try {
    const { valid, message, skip } = verifyToken(request);
    
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    await connectToDB();

    const notifications = await Notification.find()
      .populate('relatedProduct', 'name stock')
      .populate('relatedOrder', 'customerName status')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { data: notifications, message: 'Notifications fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create new notification
export async function POST(request) {
  try {
    const { valid, message, skip } = verifyToken(request);
    
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    const body = await request.json();
    await connectToDB();

    if (!body.title || !body.message) {
      return NextResponse.json(
        { message: 'Title and message are required' },
        { status: 400 }
      );
    }

    const newNotification = new Notification({
      title: body.title,
      message: body.message,
      type: body.type || 'info',
      priority: body.priority || 'medium',
      category: body.category || 'general',
      relatedProduct: body.relatedProduct,
      relatedOrder: body.relatedOrder,
    });

    await newNotification.save();

    return NextResponse.json(
      { data: newNotification, message: 'Notification created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete all notifications or specific notification
export async function DELETE(request) {
  try {
    const { valid, message, skip } = verifyToken(request);
    
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete specific notification
      const deletedNotification = await Notification.findByIdAndDelete(id);
      if (!deletedNotification) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
    } else {
      // Delete all notifications
      const result = await Notification.deleteMany({});
      return NextResponse.json({ 
        message: `Deleted ${result.deletedCount} notifications successfully` 
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
} 