import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Expense } from '@/models/expense/expense';
import { verifyToken } from '@/utils/auth';
import mongoose from 'mongoose';

// POST create new expense
export async function POST(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDB();

    // Validation
    if (!body.type || !body.amount || !body.description || !body.createdBy) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation for salary type
    if (body.type === 'salary' && !body.employee) {
      return NextResponse.json(
        { message: 'Employee ID is required for salary expenses' },
        { status: 400 }
      );
    }

    const newExpense = new Expense({
      type: body.type,
      amount: body.amount,
      description: body.description,
      date: body.date || new Date(),
      status: body.status || 'pending',
      employee: body.type === 'salary' ? body.employee : null,
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate,
      createdBy: body.createdBy
    });

    await newExpense.save();

    // Populate the references before returning
    const populatedExpense = await Expense.findById(newExpense._id)
      .populate('employee', 'name position')
      .populate('createdBy', 'name');

    return NextResponse.json(
      { data: populatedExpense, message: 'Expense created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { message: 'Failed to create expense', error: error.message },
      { status: 500 }
    );
  }
}

// GET all expenses with optional filtering
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build query object
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    const expenses = await Expense.find(query)
      .populate('employee', 'name position')
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    
    return NextResponse.json(
      { data: expenses, message: 'Expenses fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch expenses', error: error.message },
      { status: 500 }
    );
  }
}
