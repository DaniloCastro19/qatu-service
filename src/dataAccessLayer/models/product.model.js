import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; 

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: false }); 

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
    },
    ratings: {
        type: [Number],
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
});

productModel.plugin(mongoosePaginate);

export default mongoose.model('product', productModel);
