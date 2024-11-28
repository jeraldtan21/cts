import Department from "../models/Department.js";

// insert department
const addDepartment =  async (req, res) => {
    const {dep_name, description} = req.body;
    try{
        const newDep = new Department({
            dep_name,
            description
        })
        await newDep.save();
        return res.status(200).json({success: true, department: newDep})
        co
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error:"Server error in Add Departments"})
    }

}

// get department

const getDepartments = async (req, res) => {
    try{
        const departments = await Department.find()
        return res.status(200).json({success: true, departments})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error:"Server error in Get Departments"})
    }
}

// find ID for edit department
const getaIDDepartment= async (req, res) => {
    try{
        const {id} = req.params;
        const department = await Department.findById({_id: id})
        return res.status(200).json({success: true, department})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error:"Server error in Find Departments"})
    }
}

// update department
const updateDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const {dep_name, description} = req.body;
        const updateDep = await Department.findByIdAndUpdate({_id: id},{
            dep_name,
            description
        })
        return res.status(200).json({success: true, updateDep})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error:"Server error in Update Departments"})
    }
}

//delete department
const deleteDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const deleteDep = await Department.findByIdAndDelete({_id: id})
        return res.status(200).json({success: true, deleteDep})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error:"Server error in Delete Departments"})
    }
}

export {addDepartment, getDepartments, getaIDDepartment, updateDepartment, deleteDepartment}