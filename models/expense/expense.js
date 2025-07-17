import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
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
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
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
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'Expense'
});

expenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

// Delete the existing model if it exists to clear any cached validation
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

export const Expense = mongoose.model('Expense', expenseSchema);