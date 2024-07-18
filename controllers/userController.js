
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'
import { sendCookie, sendMail } from "../utils/features.js";

// Register
export const register=async(req,res)=>{
    try {

        const {name,email,password,role}=req.body;
    
        let user=await User.findOne({email});
    
        if(user){
            return res.status(404).json({
                success:false,
                message:"User already Registered with this email id"
            })
        }
        const hashedPassword= await bcrypt.hash(password,10);
        user=await User.create({name,email,password:hashedPassword,role});
     
        sendCookie(user,res,"Registered Successfully",201);
        sendMail(user,res,200);
        
    } catch (error) {
        console.error("Error during user registration:", error); // Add logging for debugging
        res.status(500).json({
            success:false,
            message:"Interner Server Error"
        })
    }
   

}
// Login
export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email}).select("+password");
    
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User does not Exist"
            });
        }
    
        const isMatch= await bcrypt.compare(password,user.password);
    
        if(!isMatch){
            return res.status(404).json({
                success:false,
                message:"User does not Exist"
            });
        }
        sendCookie(user,res,`Welcome Back ${user.name}`,200);
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Interner Server Error"
        })
    }
   

}

// Logout
export const logout=(req,res)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        sameSite:"none",
        secure:true

    }).json({
        success:"true",
        message:"Logout Successfully"

    })

}

// get my profile
export const getMyProfile=async(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })

}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllJury=async(req,res)=>{
    try {
        const user = await User.find();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
export const deleteJury = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the provided ID is valid
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Jury Deleted Successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTeamleaderName=async(req,res)=>{
    const {id}=req.body;
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}