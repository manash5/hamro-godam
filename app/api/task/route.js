import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await connectToDB();

    // Extract query params for filtering/pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build the query
    const query = {};
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('assignedTo')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTasks = await Task.countDocuments(query);

    return NextResponse.json(
      { 
        data: tasks, 
        pagination: { page, limit, total: totalTasks } 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDB();

    // Validate required fields
    if (!body.title || !body.assignedTo) {
      return NextResponse.json(
        { error: 'Title and assignedTo are required' },
        { status: 400 }
      );
    }

    // Validate assignedTo is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
      return NextResponse.json(
        { error: 'Invalid assignedTo ID' },
        { status: 400 }
      );
    }

    const newTask = new Task({
      title: body.title,
      description: body.description,
      assignedTo: body.assignedTo,
      dueDate: body.dueDate,
      status: body.status || 'pending',
    });

    await newTask.save();
    const populatedTask = await Task.populate(newTask, { path: 'assignedTo' });

    return NextResponse.json(
      { 
        data: populatedTask, 
        message: 'Task created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' }, 
      { status: 500 }
    );
  }
}