import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Notification } from '@/models/notification/notification';
import { verifyToken } from '@/utils/auth';

// PATCH - Update notification (mark as read/unread)
export async function PATCH(request, { params }) {
  try {
    const { valid, message, skip } = verifyToken(request);
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    await connectToDB();

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).populate('relatedProduct', 'name stock')
     .populate('relatedOrder', 'customerName status');

    if (!updatedNotification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: updatedNotification, message: 'Notification updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(request, { params }) {
  try {
    const { valid, message, skip } = verifyToken(request);
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    const { id } = params;
    await connectToDB();

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Notification deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
} 