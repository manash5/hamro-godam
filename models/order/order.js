import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerNumber: {
    type: Number,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  productName: {
    type: [String], // Consider making this part of an object array for better structure
    required: true,
  },
  productQuantity: {
    type: [Number],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryDate: {
    type: Date,
  },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
