import mongoose from "mongoose"

export const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URI,{
        dbName:"codequestbackend",
    }).then(()=>{
        console.log("DB Connected")
    })
}