import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    status: { type: String },
    stack: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ErrorModel = mongoose.model('Error', errorSchema);

export default ErrorModel;
