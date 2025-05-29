import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sellerId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('order', orderModel);