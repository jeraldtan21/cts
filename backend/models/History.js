import mongoose, { Schema } from "mongoose";  // Import Schema from mongoose
import Computer from '../models/Computer.js';  // Ensure you import the correct model, if needed
import User from '../models/User.js';  // Ensure you import the correct model, if needed

const HistorySchema = new Schema({
    comId: {
        type: Schema.Types.ObjectId, 
        ref: "Computer", 
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    assignee: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    
});

const History = mongoose.model("History", HistorySchema);
export default History;
