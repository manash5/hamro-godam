import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';

export async function GET() {
  try {
    await connectToDB();
    const tasks = await Task.find().populate('assignedTo').sort({ createdAt: -1 });

    return NextResponse.json({ data: tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDB();

    const newTask = new Task({
      title: body.title,
      description: body.description,
      assignedTo: body.assignedTo, // should be employee _id
      dueDate: body.dueDate,
      status: body.status || 'pending',
    });

    await newTask.save();

    return NextResponse.json(
      { data: newTask, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
