import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Task } from '@/models/task/task';
import { Notification } from '@/models/notification/notification';
import { Employee } from '@/models/employee/employee';

export async function GET(_, { params }) {
  try {
    await connectToDB();
    const task = await Task.findById(params.id).populate('assignedTo');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ data: task }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    await connectToDB();

    // Get the original task to compare status
    const originalTask = await Task.findById(params.id).populate('assignedTo');
    if (!originalTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).populate('assignedTo');

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if task status changed to completed
    if (originalTask.status !== 'completed' && updatedTask.status === 'completed') {
      // Check if notification already exists for this task completion
      const existingNotification = await Notification.findOne({
        category: 'task',
        title: 'Task Completed',
        message: { $regex: updatedTask.title, $options: 'i' }
      });

      if (!existingNotification) {
        // Get employee name - handle both populated object and ObjectId
        let employeeName = 'Unknown Employee';
        if (updatedTask.assignedTo) {
          if (typeof updatedTask.assignedTo === 'object' && updatedTask.assignedTo.name) {
            employeeName = updatedTask.assignedTo.name;
          } else {
            // If it's an ObjectId, fetch the employee
            try {
              const employee = await Employee.findById(updatedTask.assignedTo);
              employeeName = employee?.name || 'Unknown Employee';
            } catch (err) {
              console.error('Error fetching employee:', err);
            }
          }
        }
        
        // Create notification for task completion
        const notification = new Notification({
          title: 'Task Completed',
          message: `${employeeName} has completed the task: "${updatedTask.title}"`,
          type: 'success',
          category: 'task',
          priority: 'medium',
          relatedProduct: null,
          relatedOrder: null
        });

        await notification.save();
      }
    }

    return NextResponse.json(
      { data: updatedTask, message: 'Task updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ 
      error: 'Failed to update task', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectToDB();
    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
