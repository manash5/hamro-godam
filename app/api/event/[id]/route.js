import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Event } from '@/models/calendar/calendar';
import { verifyToken } from '@/utils/auth';

// GET single event
export async function GET(request, { params }) {
  const { valid, message, userId } = verifyToken(request);
  if (!valid) {
    return NextResponse.json({ message }, { status: 401 });
  }
  
  try {
    await connectToDB();
    const event = await Event.findOne({ _id: params.id, user: userId });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      data: event, 
      message: "Successfully fetched event" 
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(request, { params }) {
  const { valid, message, userId } = verifyToken(request);
  if (!valid) {
    return NextResponse.json({ message }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    await connectToDB();
    
    const event = await Event.findOne({ _id: params.id, user: userId });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        location: body.location,
        start: new Date(body.start),
        end: new Date(body.end),
        allDay: body.allDay,
        timezone: body.timezone,
        repeat: body.repeat,
        description: body.description,
        color: body.color,
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      data: updatedEvent, 
      message: "Event updated successfully" 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(request, { params }) {
  const { valid, message, userId } = verifyToken(request);
  if (!valid) {
    return NextResponse.json({ message }, { status: 401 });
  }
  
  try {
    await connectToDB();
    
    const event = await Event.findOne({ _id: params.id, user: userId });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    await Event.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      message: "Event deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete event' }, { status: 500 });
  }
}