import express from 'express'
import {addDepartment, getDepartments, getaIDDepartment, updateDepartment, deleteDepartment} from '../controllers/departmentController.js'
import authMiddleware from '../middleware/authMiddlware.js'


const router = express.Router()

router.post('/add', authMiddleware, addDepartment)
router.get('/', authMiddleware, getDepartments)
router.get('/:id', authMiddleware, getaIDDepartment)
router.put('/:id', authMiddleware, updateDepartment)
router.delete('/:id', authMiddleware, deleteDepartment)


export default router;