import express from "express";
import { 
  contestDetails, 
  createContest, 
  getAllContest, 
  getUserContests, 
  registerContest, 
  registerTeam, // Import the new controller function for team registration
  scoreSubmission, 
  submitAnswer 
} from "../controllers/contestController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createContest);
router.get('/register/:id', isAuthenticated, registerContest);
router.post('/register/team/:id', isAuthenticated, registerTeam); // New route for team registration
router.get('/getcontests', isAuthenticated, getAllContest);
router.get('/getcontest/:id', isAuthenticated, contestDetails);
router.post('/submit/:id', isAuthenticated, submitAnswer);
router.post('/score/:contestId/:submissionId', isAuthenticated, scoreSubmission);
router.get('/mycontests', isAuthenticated, getUserContests);
// router.put('/update/:submissionId', isAuthenticated, UpdateContest);

export default router;
