import mongoose, { Schema } from "mongoose";

// Define the Computer Schema
const computerSchema = new Schema(
  {
    comModel: {
      type: String,
      required: true,
    },
    comSerial: {
      type: String,
      required: true,
      unique: true,
    },
    comCpu: {
      type: String,
      required: true,
    },
    comRam: {
      type: String,
      required: true,
    },
    comStorage: {
      type: String,
      required: true,
    },
    comGpu: {
      type: String,
      required: true,
    },
    comOs: {
      type: String,
      required: true,
    },
    cpuAccount: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: {
      type: String,
      default: "working",
    },
    comType: {
      type: String,
      required: true,
    },
    comImage: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the Computer model
const Computer = mongoose.model("Computer", computerSchema);

export default Computer;
