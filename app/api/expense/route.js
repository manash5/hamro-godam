import { NextResponse } from 'next/server';
import connectToDB from '@/lib/connectDb';
import { Expense } from '@/models/expense/expense';
import { Employee } from '@/models/employee/employee';
import { verifyToken } from '@/utils/auth';
import mongoose from 'mongoose';

// POST create new expense
export async function POST(request) {
  try {
    console.log('POST request received');
    
    // Check environment variables
    console.log('Environment check:', {
      hasMongoUrl: !!process.env.MONGODB_URL,
      hasSecretKey: !!process.env.secretKey,
      mongoUrlLength: process.env.MONGODB_URL?.length || 0
    });
    
    const { valid, message, skip } = verifyToken(request);
    console.log('Token verification result:', { valid, message, skip });
    
    if (!valid && !skip) {
      return NextResponse.json({ message }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received expense data:', body);
    
    await connectToDB();
    console.log('Database connected successfully');

    // Validation
    if (!body.type || !body.amount || !body.description || !body.createdBy) {
      console.log('Missing required fields:', { type: body.type, amount: body.amount, description: body.description, createdBy: body.createdBy });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating expense with data:', {
      type: body.type,
      amount: body.amount,
      description: body.description,
      date: body.date || new Date(),
      status: body.status || 'pending',
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate,
      createdBy: body.createdBy
    });

    // Log the Expense model schema to see what validation is active
    console.log('Expense model type field:', Expense.schema.paths.type);

    const newExpense = new Expense({
      type: body.type,
      amount: body.amount,
      description: body.description,
      date: body.date || new Date(),
      status: body.status || 'pending',
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate,
      createdBy: body.createdBy
    });

    console.log('Expense object created:', newExpense);
    console.log('Validating expense...');
    
    // Validate the expense manually to see what's wrong
    const validationError = newExpense.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { message: 'Validation failed', error: validationError.message },
        { status: 400 }
      );
    }

    await newExpense.save();
    console.log('Expense saved successfully');

    // Return the expense without population since we removed employee reference
    return NextResponse.json(
      { data: newExpense, message: 'Expense created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating expense:', error);
    console.error('Error stack:', error.stack);
    
    // Always return a proper JSON response
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

// PUT generate salary expenses for all employees
export async function PUT(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    console.log('PUT request received - Generating salary expenses');
    await connectToDB();

    // Fetch all employees with salary
    const employees = await Employee.find({ salary: { $exists: true, $ne: null, $gt: 0 } });
    console.log(`Found ${employees.length} employees with salary`);

    if (employees.length === 0) {
      return NextResponse.json(
        { message: 'No employees found with salary information' },
        { status: 404 }
      );
    }

    const generatedExpenses = [];

    for (const employee of employees) {
      // Calculate salary date (30 days from creation date)
      const salaryDate = new Date(employee.createdAt);
      salaryDate.setDate(salaryDate.getDate() + 30);

      // Check if salary expense already exists for this employee and date
      const existingExpense = await Expense.findOne({
        type: 'salary',
        description: `Salary for ${employee.name}`,
        date: {
          $gte: new Date(salaryDate.getFullYear(), salaryDate.getMonth(), salaryDate.getDate()),
          $lt: new Date(salaryDate.getFullYear(), salaryDate.getMonth(), salaryDate.getDate() + 1)
        }
      });

      if (!existingExpense) {
        const salaryExpense = new Expense({
          type: 'salary',
          amount: employee.salary,
          description: `Salary for ${employee.name}`,
          date: salaryDate,
          status: 'pending',
          paymentMethod: 'bank_transfer',
          createdBy: 'system'
        });

        await salaryExpense.save();
        generatedExpenses.push(salaryExpense);
        console.log(`Generated salary expense for ${employee.name}: $${employee.salary}`);
      } else {
        console.log(`Salary expense already exists for ${employee.name} on ${salaryDate.toDateString()}`);
      }
    }

    return NextResponse.json(
      { 
        message: `Generated ${generatedExpenses.length} salary expenses`,
        data: generatedExpenses,
        totalEmployees: employees.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error generating salary expenses:', error);
    return NextResponse.json(
      { message: 'Failed to generate salary expenses', error: error.message },
      { status: 500 }
    );
  }
}
