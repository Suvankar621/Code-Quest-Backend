import express from "express";
import { createContest, getAllContest, registerContest, submitAnswer } from "../controllers/contestController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/create",isAuthenticated,createContest)
router.post('/register/:id',isAuthenticated, registerContest);
router.get('/getcontests',isAuthenticated,getAllContest);
router.post('/submit/:id',isAuthenticated,submitAnswer)

export default router;