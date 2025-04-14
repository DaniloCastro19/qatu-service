import mongoose from 'mongoose';
import User from './user.model.js';

const productModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    vendor: {
        type: User,
        required: true,
        trim: true
    }
});

export default mongoose.model('product', productModel);