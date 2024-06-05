import express from "express";
import { contestDetails, createContest, getAllContest, getUserContests, registerContest, scoreSubmission, submitAnswer } from "../controllers/contestController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/create",isAuthenticated,createContest)
router.get('/register/:id',isAuthenticated, registerContest);
router.get('/getcontests',isAuthenticated,getAllContest);
router.get('/getcontest/:id',isAuthenticated,contestDetails);
router.post('/submit/:id',isAuthenticated,submitAnswer);
router.post('/score/:contestId/:submissionId',isAuthenticated, scoreSubmission);
router.get('/mycontests', isAuthenticated, getUserContests);

export default router;