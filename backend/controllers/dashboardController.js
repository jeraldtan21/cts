import Computer from "../models/Computer.js";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalComputer = await Computer.countDocuments();

    // Count computers by status
    const workingComputers = await Computer.countDocuments({ status: "working" });
    const defectiveComputers = await Computer.countDocuments({ status: "defective" });
    const warrantyComputers = await Computer.countDocuments({ status: "warranty" });
    const repairComputers = await Computer.countDocuments({ status: "repair" });

    return res.status(200).json({ 
      success: true, 
      totalEmployees, 
      totalDepartments, 
      totalComputer,
      workingComputers,
      defectiveComputers,
      warrantyComputers,
      repairComputers,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching summary" 
    });
  }
};

export { getSummary };
