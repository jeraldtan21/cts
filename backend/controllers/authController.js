import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// login
const login = async (req, res) => {
     try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            res.status(404);
           throw new Error("User Not Found")
           }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.status(404);
            throw new Error("Invalid email or password")
            }

        const token = jwt.sign({_id: user._id, role: user.role},
            process.env.JWT_KEY, {expiresIn: "1d"}
        )

        res.status(200).json({success: true, token, user: {_id: user.id, name: user.name, role: user.role},
        });
       

     }catch(error){
        
       res.status(500).json({success: false, error: error.message})
     }
};

// verify
const verify = (req, res) => {
    return res.status(200).json({success: true, user: req.user})
}

export {login, verify}