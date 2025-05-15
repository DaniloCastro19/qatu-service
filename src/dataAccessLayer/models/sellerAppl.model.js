import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const sellerApplicationModel = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'denied', 'accepted'],
        default: 'pending'
    }
});

sellerApplicationModel.plugin(mongoosePaginate);

export default mongoose.model('sellerApplication', sellerApplicationModel);
