import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['salary', 'operational', 'inventory', 'other'], // Different expense types
    default: 'other'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: function() { return this.type === 'salary'; } 
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: function() { return this.type === 'salary'; } 
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'digital_wallet', null],
    default: null
  },
  paymentDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true,
  collection: 'Expense'
});

// Virtual for checking if expense is overdue
expenseSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.status === 'pending' && this.dueDate < new Date();
});

// Middleware to update status based on due date
expenseSchema.pre('save', function(next) {
  if (this.dueDate && this.dueDate < new Date() && this.status === 'pending') {
    this.status = 'overdue';
  }
  next();
});

expenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);