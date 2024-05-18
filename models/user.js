import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        select:false
    },
    role:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

})

export const User=mongoose.model("User",userSchema);