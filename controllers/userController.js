
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'
import { sendCookie } from "../utils/features.js";

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