import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Expense } from '@/models/expense/expense';
import { verifyToken } from '@/utils/auth';
import mongoose from 'mongoose';

// GET expense by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: expense, message: 'Expense fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { message: 'Failed to fetch expense', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH update expense by ID
export async function PATCH(request, { params }) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      );
    }

    // Update only the fields that are provided in the request
    expense.type = body.type ?? expense.type;
    expense.amount = body.amount ?? expense.amount;
    expense.description = body.description ?? expense.description;
    expense.date = body.date ?? expense.date;
    expense.status = body.status ?? expense.status;
    expense.paymentMethod = body.paymentMethod ?? expense.paymentMethod;
    expense.paymentDate = body.paymentDate ?? expense.paymentDate;

    
    await expense.save();

    // Return the expense without population since we removed employee reference
    return NextResponse.json(
      { data: expense, message: 'Expense updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { message: 'Failed to update expense', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE expense by ID
export async function DELETE(request, { params }) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = params;
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { message: 'Failed to delete expense', error: error.message },
      { status: 500 }
    );
  }
}