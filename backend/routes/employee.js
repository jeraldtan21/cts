import express from 'express'
import { addEmployee, upload, getEmployee, getaIDEmployee,updateEmployee, updateProfileImage, changePassword,getActiveEmployee } from '../controllers/employeeController.js';
import authMiddleware from '../middleware/authMiddlware.js'


const router = express.Router()

router.post('/add', authMiddleware, upload.single('image'), addEmployee)
router.get('/', authMiddleware, getEmployee)
router.get('/active/', authMiddleware, getActiveEmployee)
router.get('/:id', authMiddleware, getaIDEmployee)
router.put('/edit/:id', authMiddleware, updateEmployee)
//router.delete('/:id', authMiddleware, deleteDepartment)

// New route for updating profile image
router.put('/update-profile-image/:id', authMiddleware, upload.single('profileImage'), updateProfileImage);

// New route for changing password
router.put('/change-password/:id', authMiddleware, changePassword);




export default router;