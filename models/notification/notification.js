import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['alert', 'success', 'info', 'warning'],
    default: 'info',
  },
  isUnread: {
    type: Boolean,
    default: true,
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['stock', 'order', 'system', 'general', 'task'],
    default: 'general',
  }
}, {
  timestamps: true,
  collection: 'Notifications'
});

notificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema); 