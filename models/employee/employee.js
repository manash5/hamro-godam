import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // emails must be unique
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  collection: 'Employees'
});

employeeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
