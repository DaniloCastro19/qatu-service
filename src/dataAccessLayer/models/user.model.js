import mongoose from "mongoose";

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

export default mongoose.model('user', userModel);
