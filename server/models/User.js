import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'seeker'],
      default: 'seeker'
    },
    classification: {
      type: String,
      enum: ['Multiple Cards', 'One Card', 'None / Shopper', 'None / New User'],
      required: true
    },
    isKycVerified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    },
    stats: {
      listedCards: { type: Number, default: 0 },
      activeRequests: { type: Number, default: 0 },
      ordersCompleted: { type: Number, default: 0 },
      feeEarned: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
