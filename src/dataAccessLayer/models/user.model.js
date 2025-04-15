import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'seller', 'customer'],
        default: 'customer'
      },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    invalidateBefore: { type: Date, default: new Date(0) }
    }, { timestamps: true });

    userModel.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
      
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(this.password, saltRounds);
          this.password = hashedPassword;
          next();
        } catch (err) {
          next(err);
        }
      });

export default mongoose.model('user', userModel);
