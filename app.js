import express from "express";
import userRoutes from "./routes/user.js";
import {config} from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import contestRoutes from './routes/contestRoutes.js'


export const app=express();

config({
    path:"./data/config.env"
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL,"http://localhost:3000","http://127.0.0.1:5500"],
    credentials:true
}));


app.use("/api/v1/users",userRoutes);
app.use("/api/v1/contest",contestRoutes)

