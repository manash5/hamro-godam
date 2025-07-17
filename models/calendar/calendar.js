import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  timezone: {
    type: Boolean,
    default: false,
  },
  repeat: {
    type: String,
    enum: ['Never', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: 'Never',
  },
  description: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'bg-blue-500',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  collection: 'Events'
});

eventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);