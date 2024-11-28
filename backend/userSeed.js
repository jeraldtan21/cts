import User from "./models/User.js"
import bcrypt from 'bcrypt'
import connectToDatabase from "./db/db.js"
import express from "express"

const router = express.Router()

router.post('/reg', (req,res) => {
    userRegister()
    res.send("SUCCESSD")
})

const userRegister = async () => {
    connectToDatabase()
    try{

        const hashPassword  = await bcrypt.hash("admin12345", 10)
        const newUser = new User({
            name: "admin2",
            email: "admin2@mail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()

    } 
    catch(error){
        console.log(error)
    }
}

export default router

// userRegister();