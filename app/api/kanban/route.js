import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';
import { verifyToken } from '@/utils/auth';

// POST - Create a new task
export async function POST(request) {
  try {
    console.log('POST request received for new task');
    
    // Authentication check
    const { valid, message, skip } = verifyToken(request);
    console.log('Token verification result:', { valid, message, skip });
    
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received task data:', body);
    
    await connectToDB();
    console.log('Database connected successfully');

    // Validation
    if (!body.title || !body.category || !body.assignee) {
      console.log('Missing required fields:', {
        title: body.title,
        category: body.category,
        assignee: body.assignee
      });
      return NextResponse.json(
        { message: 'Missing required fields (title, category, assignee)' },
        { status: 400 }
      );
    }

    console.log('Creating task with data:', {
      title: body.title,
      category: body.category,
      description: body.description || '',
      assignee: body.assignee,
      status: body.status || 'To Review',
      priority: body.priority || 'MEDIUM',
      createdAt: new Date()
    });

    const newTask = new Task({
      title: body.title,
      category: body.category,
      description: body.description,
      assignee: body.assignee,
      status: body.status || 'To Review',
      priority: body.priority || 'MEDIUM'
    });

    console.log('Task object created:', newTask);
    
    const validationError = newTask.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { message: 'Validation failed', error: validationError.message },
        { status: 400 }
      );
    }

    await newTask.save();
    console.log('Task saved successfully');

    return NextResponse.json(
      { data: newTask, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { message: 'Failed to create task', error: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all tasks with optional filtering
export async function GET(request) {
  try {
    console.log('GET request received for tasks');
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const assignee = searchParams.get('assignee');
    const priority = searchParams.get('priority');
    
    // Build query object
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (assignee) {
      query.assignee = assignee;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    console.log('Fetching tasks with query:', query);
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { data: tasks, message: 'Tasks fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tasks', error: error.message },
      { status: 500 }
    );
  }
}