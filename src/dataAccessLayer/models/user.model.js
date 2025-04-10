import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    //Define your schema here
);

export default mongoose.model('user', userModel);
