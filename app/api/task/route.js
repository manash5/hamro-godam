import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';
import { Employee } from '@/models/employee/employee';
import { Notification } from '@/models/notification/notification';


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

    // Get employee details for notification
    const employee = await Employee.findById(body.assignedTo);
    const employeeName = employee?.name || 'Unknown Employee';

    // Create notification for new task assignment
    const notification = new Notification({
      title: 'New Task Assigned',
      message: `New task "${body.title}" has been assigned to ${employeeName}`,
      type: 'info',
      category: 'task',
      priority: body.priority || 'medium',
      relatedProduct: null,
      relatedOrder: null
    });

    await notification.save();

    return NextResponse.json(
      { data: newTask, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ 
      error: 'Failed to create task', 
      details: error.message 
    }, { status: 500 });
  }
}

// PATCH - Create notifications for all completed tasks
export async function PATCH(request) {
  try {
    await connectToDB();

    // Get all completed tasks
    const completedTasks = await Task.find({ status: 'completed' }).populate('assignedTo');

    let createdCount = 0;

    for (const task of completedTasks) {
      // Check if notification already exists for this task (more specific check)
      const existingNotification = await Notification.findOne({
        category: 'task',
        title: 'Task Completed',
        message: { $regex: task.title, $options: 'i' }
      });

      if (!existingNotification) {
        const employeeName = task.assignedTo?.name || 'Unknown Employee';
        
        const notification = new Notification({
          title: 'Task Completed',
          message: `${employeeName} has completed the task: "${task.title}"`,
          type: 'success',
          category: 'task',
          priority: 'medium',
          relatedProduct: null,
          relatedOrder: null
        });

        await notification.save();
        createdCount++;
      }
    }

    return NextResponse.json(
      { 
        message: `Created ${createdCount} notifications for ${completedTasks.length} completed tasks`,
        createdCount,
        totalCompletedTasks: completedTasks.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating notifications for completed tasks:', error);
    return NextResponse.json({ 
      error: 'Failed to create notifications for completed tasks', 
      details: error.message 
    }, { status: 500 });
  }
}
