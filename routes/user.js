import express from "express";
import { deleteJury, getAllJury, getMyProfile, getTeamleaderName, getUserById, login, logout, register } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/new",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/me", isAuthenticated ,getMyProfile);
router.get("/user/:id", isAuthenticated, getUserById); 
router.get("/jury", getAllJury); 
router.delete("/jury/:id", isAuthenticated, deleteJury); 
router.post("/leadername", getTeamleaderName); 




export default router;