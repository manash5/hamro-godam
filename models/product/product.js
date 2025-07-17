import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, 
  },
  status: {
    type: Boolean,
    required: true,
    default: true, 
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
}, {
  timestamps: true,            
  collection: 'Products'        
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
