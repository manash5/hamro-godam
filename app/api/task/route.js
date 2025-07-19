import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';
import { Employee } from '@/models/employee/employee';


export async function GET(request) {
  try {
    await connectToDB();
    let tasks;
    if (request && request.url) {
      const url = new URL(request.url);
      const assignedTo = url.searchParams.get('assignedTo');
      if (assignedTo) {
        tasks = await Task.find({ assignedTo }).populate({ path: 'assignedTo', strictPopulate: false }).sort({ createdAt: -1 });
      } else {
        tasks = await Task.find().populate({ path: 'assignedTo', strictPopulate: false }).sort({ createdAt: -1 });
      }
    } else {
      tasks = await Task.find().populate({ path: 'assignedTo', strictPopulate: false }).sort({ createdAt: -1 });
    }

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
      assignedTo: body.assignedTo,
      dueDate: body.dueDate,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      tags: body.tags || [],
      category: body.category,
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
