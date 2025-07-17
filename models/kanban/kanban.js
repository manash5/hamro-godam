import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignee: {
    type: String,
    required: [true, 'Assignee initials are required'],
    trim: true,
    uppercase: true,
    maxlength: [3, 'Assignee initials should be 3 characters or less']
  },
  status: {
    type: String,
    required: true,
    enum: ['To Review', 'In Progress', 'Ready to Launch', 'Live'],
    default: 'To Review'
  },
  priority: {
    type: String,
    enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'ACTIVE', 'READY', 'LIVE'],
    default: 'MEDIUM'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);