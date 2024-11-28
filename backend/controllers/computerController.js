import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Computer from '../models/Computer.js';
import Employee from '../models/Employee.js'; // Import the User model
import History from '../models/History.js'; // Import the History model
import User from '../models/User.js'; // Import the User model


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/computers";
    // Ensure the upload directory exists
    fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique file name
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Example of file type validation (you can customize it)
    const fileTypes = /jpeg|jpg|png|gif|jfif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, jfif)"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Insert computer
const addComputer = async (req, res) => {
    try {
      const {
        comModel,
        comSerial,
        comCpu,
        comRam,
        comStorage,
        comGpu,
        comOs,
        cpuAccount,
        status,
        comType,
      } = req.body;
  

      const existingSerial = await Computer.findOne({ comSerial });
    if (existingSerial) {
      return res
        .status(400)
        .json({ success: false, message: "Computer serial number already exists" });
    }
  
      const newCom = new Computer({
        comModel,
        comSerial,
        comCpu,
        comRam,
        comStorage,
        comGpu,
        comOs,
        cpuAccount,
        status,
        comType,
        comImage: req.file ? `uploads/computers/${req.file.filename}` : null,
      });
  
      await newCom.save();
      return res.status(200).json({ success: true, message: "Computer created successfully" });
    } catch (error) {
      console.error('Error adding computer:', error);
      return res.status(500).json({ success: false, error: "Server error while creating computer" });
    }
  };


// Get computer
const getComputer = async (req, res) => {
  try {
    const computers = await Computer.find({})
    .populate({
      path: "cpuAccount",
      populate: {
        path: "userId",
        options: {strictPopulate: false}
      }
    }); // Populate the name directly from cpuAccount
    
    return res.status(200).json({ success: true, computers });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error in Get Computer" });
  }
};

// View employee and edit
const getaIDComputer = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch computer by ID and populate `cpuAccount` and nested `userId` details
    const computer = await Computer.findById(id).populate({
      path: "cpuAccount",
      populate: {
        path: "userId",
        options: { strictPopulate: false }, // Ensure strict populate is disabled for flexibility
      },
    });

    // If computer not found, send a 404 response
    if (!computer) {
      return res.status(404).json({ success: false, error: "Computer not found" });
    }

    // Respond with the computer data
    return res.status(200).json({ success: true, computer });
  } catch (error) {
    console.error("Error fetching computer:", error.message);
    return res.status(500).json({ success: false, error: "Server error in fetching computer" });
  }
};


// Update Computer
const updateComputer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      comModel,
      comSerial,
      comCpu,
      comRam,
      comStorage,
      comGpu,
      comOs,
      cpuAccount,
      status,
      comType,
    } = req.body;

    // Find the computer by ID
    const computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({ success: false, error: "Computer not found" });
    }

    // If `cpuAccount` is provided, validate and update
    let updatedAccount = null;
    if (cpuAccount) {
      updatedAccount = await Employee.findById(cpuAccount);
      if (!updatedAccount) {
        return res.status(400).json({ success: false, error: "Associated user not found" });
      }
    }

    // Update computer information
    const updatedComputer = await Computer.findByIdAndUpdate(
      id,
      {
        comModel,
        comSerial,
        comCpu,
        comRam,
        comStorage,
        comGpu,
        comOs,
        cpuAccount: updatedAccount ? updatedAccount._id : computer.cpuAccount,
        status,
        comType,
        updatedAt: Date.now(), // Explicitly updating the `updatedAt` field
      },
      { new: true } // Ensure the returned document is the updated one
    );

    if (!updatedComputer) {
      return res.status(404).json({ success: false, error: "Update failed, computer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Computer updated successfully",
      computer: updatedComputer,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Server error while updating computer",
    });
  }
};



// Update profile image for computer
const updateComImage = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the computer by ID or userId
    const computer = await Computer.findOne({ $or: [{ _id: id }, { userId: id }] });

    if (!computer) {
      return res.status(404).json({ success: false, error: "Computer not found" });
    }

    // Resolve __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Remove old profile image if it exists
    if (computer.comImage) {
      const oldImagePath = path.join(__dirname, "../public/uploads/computers", computer.comImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image file
      }
    }

    // Update the computer's profile image path
    const updatedComputer = await Computer.findByIdAndUpdate(
      computer._id,
      { comImage: `uploads/computers/${req.file.filename}` },
      { new: true }
    );

    if (!updatedComputer) {
      return res
        .status(400)
        .json({ success: false, error: "Failed to update profile image" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      comImage: updatedComputer.comImage, // Return the updated profile image path
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error in updateComImage" });
  }
};

// Function to add a new history log
const addHistory = async (req, res) => {
  const { comId, remarks, assignee } = req.body;  // Get data from the request body

  try {
    // Validate that the computer exists
    const computer = await Computer.findById(comId);
    if (!computer) {
      return res.status(404).json({ message: 'Computer not found' });
    }

    // Validate that the assignee (user) exists
    const user = await User.findById(assignee);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new history log
    const newHistory = new History({
      comId,
      remarks,
      assignee,
    });

    // Save the history log to the database
    await newHistory.save();

    // Respond with the newly created history log
    return res.status(200).json({success: true, newHistory})
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// Get history for a specific computer by its ID
const getHistory = async (req, res) => {
  try {
    const { id } = req.params;  // Get computer ID from params

    console.log("Fetching history for computer ID:", id);  // Debugging log

    // Query the history based on the computer ID
    const computerHistory = await History.find({ comId: id })  // Use the computer ID to find history
      .populate({
        path: "assignee",
        populate: {
          path: "userId",
          options: { strictPopulate: false },  // Populate the assignee if necessary
        
        },
      });

 
    return res.status(200).json({ success: true, computerHistory });
  } catch (error) {
    console.error("Error fetching computer history:", error.message);  // Enhanced error logging
    return res.status(500).json({ success: false, error: 'Server error in getting computer history.' });
  }
};

//ito yung admin view profile
const getAccount = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching accountability for computer ID:", id);  // Debugging log

  try {
    let computers;

    // Find computers with a specific cpuAccount
    if(!computers)
    computers = await Computer.find({ "cpuAccount": id })
      .populate({
        path: "cpuAccount", // Populate the cpuAccount field
        options: { strictPopulate: false },
      });
      if(!computers)
      computers = await Computer.findOne({ "cpuAccount": id })
      .populate({
        path: "cpuAccount", // Populate the cpuAccount field
        options: { strictPopulate: false },
      });


    // If no computers found, return an error
    if (!computers || computers.length === 0) {
      return res.status(404).json({ success: false, error: "No computers found" });
    }

    // Return the list of computers
    return res.status(200).json({ success: true, computerHistory: computers });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error in Get Computers" });
  }
};

// ito ung sa employee profile
const getProfileAccount = async (req, res) => {
  const { id } = req.params; // The userId from the request parameters
  console.log("Fetching accountability for user ID:", id); // Debugging log

  try {
    // Find the User by userId
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Find the Employee linked to the user
    const employee = await Employee.findOne({ userId: id });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Find Computers associated with the employee's ID
    const computers = await Computer.find({ cpuAccount: employee._id });

    if (!computers || computers.length === 0) {
      return res.status(404).json({ success: false, error: "No computers found for this employee" });
    }

    // Return the user, employee, and computer details
    return res.status(200).json({
      success: true,
      user,
      employee,
      computerHistory: computers,
    });
  } catch (error) {
    console.error("Error fetching account information:", error.message);
    return res.status(500).json({ success: false, error: "Server error in Get Account" });
  }
};

export default updateComImage;

export { upload, addComputer, getComputer, getaIDComputer,updateComputer, updateComImage, addHistory, getHistory,getAccount, getProfileAccount };
