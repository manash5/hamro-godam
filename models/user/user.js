import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
  },
  salary: {
    type: Number,
    default: 0,  
    required: true,  
  }
}, {
  timestamps: true, 
  collection: 'Users' 
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);