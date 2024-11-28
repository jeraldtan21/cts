import mongoose, { Schema } from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  {
    timestamps: true, // Enables automatic `createdAt` and `updatedAt`
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
