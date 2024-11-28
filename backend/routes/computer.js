import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import {addComputer,upload, getComputer, getaIDComputer, updateComputer, updateComImage, addHistory, getHistory, getAccount, getProfileAccount} from '../controllers/computerController.js'

const router = express.Router()

router.post('/add', authMiddleware, upload.single('image'), addComputer)
router.get('/', authMiddleware, getComputer)
router.get('/:id', authMiddleware, getaIDComputer)
router.put('/edit/:id', authMiddleware, updateComputer)


router.post('/history/add-history', authMiddleware, addHistory)
router.get('/history/:id', authMiddleware, getHistory)
router.get('/account/:id', authMiddleware, getAccount);
router.get('/profile/:id', authMiddleware, getProfileAccount);


// New route for updating profile image
router.put('/update-computer-image/:id', authMiddleware, upload.single('profileImage'), updateComImage);

export default router;