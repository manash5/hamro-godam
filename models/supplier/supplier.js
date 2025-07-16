import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_number: {
    type: String,  
    required: true,
  },
  address: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },

  company_name: {
    type: String,
  },

}, {
  timestamps: true,
  collection: 'Suppliers',
});

supplierSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

supplierSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplier',
  justOne: false,
});

export const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
