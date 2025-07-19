import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Event } from '@/models/calendar/calendar';
import { verifyToken } from '@/utils/auth';

// POST create new event
export async function POST(request) {
  const { valid, message, userId } = verifyToken(request);
  if (!valid) {
    return NextResponse.json({ message }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    await connectToDB();

    const newEvent = new Event({
      title: body.title,
      location: body.location,
      start: new Date(body.start),
      end: new Date(body.end),
      allDay: body.allDay,
      timezone: body.timezone,
      repeat: body.repeat,
      description: body.description,
      color: body.color,
      user: userId,
    });

    await newEvent.save();

    return NextResponse.json(
      { data: newEvent, message: 'Event created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
  }
}

// GET all events for a user
export async function GET(request) {
  const { valid, message, userId } = verifyToken(request);
  if (!valid) {
    return NextResponse.json({ message }, { status: 401 });
  }
  
  try {
    await connectToDB();
    
    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    
    let query = { user: userId };
    
    // If date range is provided, filter events that overlap the range
    if (startDate && endDate) {
      query = {
        user: userId,
        $or: [
          {
            start: { $lte: new Date(endDate) },
            end: { $gte: new Date(startDate) }
          }
        ]
      };
    }
    
    const events = await Event.find(query).sort({ start: 1 });
    
    return NextResponse.json({ 
      data: events, 
      message: "Successfully fetched events" 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}