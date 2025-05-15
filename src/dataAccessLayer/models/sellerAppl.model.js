import mongoose from "mongoose";

const sellerApplicationModel = new mongoose.Schema({
    userID: {
        type: ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'denied', 'accepted'],
        default: 'pending'
    }
});

export default mongoose.model('sellerApplication', sellerApplicationModel);
