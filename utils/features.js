import jwt from "jsonwebtoken";
export const sendCookie=(user,res,message,statusCode=200)=>{
    const token=  jwt.sign({_id:user._id},process.env.JWT_SECRET);

    res.status(201).cookie("token",token,{
        httpOnly:true,
        maxAge:60*60*1000,
        sameSite:"none",
        secure:true
    }).json({
        success:true,
        message:message
    })
}