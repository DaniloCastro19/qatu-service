import mongoose from 'mongoose';
import User from './user.model.js';

const productModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        trim: true
    },
    vendorId: {
        type: mongoose.Types.ObjectId
    }
});

export default mongoose.model('product', productModel);