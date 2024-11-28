import multer from "multer";
import fs from "fs";
import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Department from "../models/Department.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/employees");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Insert employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      employeeId,
      dob,
      gender,
      department,
     status,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const existingID = await Employee.findOne({ employeeId });
    if (existingID) {
      return res
        .status(400)
        .json({ success: false, error: "Email Employee ID registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      status,
      profileImage: req.file
        ? `uploads/employees/${req.file.filename}`
        : "", // Save path
    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      department,
    });
    await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee created" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in New Employee" });
  }
};

// Get employees
const getEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in Get Employees" });
  }
};

// Get active employees with active userId
const getActiveEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({
        path: "userId", // Populate the userId field
        match: { status: 'active' }, // Only include users with 'status' set to 'active'
        select: { password: 0 } // Exclude the password field
      })
      .populate("department");

    // Filter out employees where the userId is null or inactive
    const activeEmployees = employees.filter(employee => employee.userId !== null);

    return res.status(200).json({ success: true, employees: activeEmployees });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in Get Active Employees" });
  }
};

// View employee and edit
const getaIDEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    if(!employee)
      employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if(!employee)
      employee = await Employee.findOne({ userId: id })
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in Get Employees" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, employeeId, dob, gender, department, status } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(400).json({ success: false, error: "Employee not found" });
    }

    // Find the user associated with the employee
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      employee.userId,
      { name, email, role, status },
      { new: true, timestamps: true } // Automatically updates `updatedAt`
    );

    // Update employee information
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        employeeId,
        dob,
        gender,
        department,
      },
      { new: true, timestamps: true } // Automatically updates `updatedAt`
    );

    if (!updatedUser || !updatedEmployee) {
      return res
        .status(404)
        .json({ success: false, error: "Update failed, document not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in Update Employee" });
  }
};


// Update profile image for employee
const updateProfileImage = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findOne({ $or: [{ _id: id }, { userId: id }] });

   if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
     }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Get the current directory path (Fix for __dirname in ES module)
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    // Remove old profile image if it exists
    if (user.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "public/uploads/employees",
        user.profileImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the user's profile image path
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profileImage: `uploads/employees/${req.file.filename}` },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ success: false, error: "Failed to update profile image" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: updatedUser.profileImage, // Return the updated profile image path
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in updateProfileImage" });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  try {
      const employee = await Employee.findById(id).populate('userId');  // Populate user
      if (!employee || !employee.userId) {
          return res.status(404).json({ error: "Employee or User not found" });
      }

      // Hash the new password and update it
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.userId.password = hashedPassword;
      await employee.userId.save();

      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the password" });
  }
};

export {
  addEmployee,
  upload,
  getEmployee,
  getaIDEmployee,
  updateEmployee,
  updateProfileImage,
  changePassword,
  getActiveEmployee,
};
