import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import Task from '@/models/kanban/kanban';
import { verifyToken } from '@/utils/auth';
import mongoose from 'mongoose';

// GET - Get single task by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`GET request received for task ID: ${id}`);
    
    await connectToDB();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid task ID format' },
        { status: 400 }
      );
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { data: task, message: 'Task fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { message: 'Failed to fetch task', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a task
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log(`PUT request received for task ID: ${id}`);
    
    // Authentication check
    const { valid, message, skip } = verifyToken(request);
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }
    
    const body = await request.json();
    console.log('Update data:', body);
    
    await connectToDB();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid task ID format' },
        { status: 400 }
      );
    }
    
    const updatedTask = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!updatedTask) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { data: updatedTask, message: 'Task updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Failed to update task', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a task
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`DELETE request received for task ID: ${id}`);
    
    // Authentication check
    const { valid, message, skip } = verifyToken(request);
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }
    
    await connectToDB();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid task ID format' },
        { status: 400 }
      );
    }
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { data: deletedTask, message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Failed to delete task', error: error.message },
      { status: 500 }
    );
  }
}