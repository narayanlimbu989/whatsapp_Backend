import mongoose from "mongoose";

const messageSchema =new mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    receiver: Boolean
},{timestamps: true});
export const message = mongoose.model("messages", messageSchema);
