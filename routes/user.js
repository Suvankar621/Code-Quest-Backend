import express from "express";
import { getMyProfile, getUserById, login, logout, register } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/new",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/me", isAuthenticated ,getMyProfile);
router.get("/user/:id", isAuthenticated, getUserById); 


export default router;