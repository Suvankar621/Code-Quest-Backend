import express from "express";
import userRoutes from "./routes/user.js";
import {config} from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";


export const app=express();

config({
    path:"./data/config.env"
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL]
}));


app.use("/api/v1/users",userRoutes);

