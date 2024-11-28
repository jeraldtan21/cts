import express from 'express'
import cors from 'cors';
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectDb from './db/db.js'
import settingsRouter from './routes/settings.js'
import dashboardRouter from './routes/dashboard.js'
import computerRouter from './routes/computer.js'
import userRoute from './userSeed.js'

connectDb()
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors()) 
app.use('/uploads', express.static('public/uploads'));

//routes
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/setting', settingsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/computer', computerRouter )




app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT:${process.env.PORT}`)
})