import express from "express";
import { 
  contestDetails, 
  createContest, 
  getAllContest, 
  getUserContests, 
  registerTeam, // Import the new controller function for team registration
  scoreSubmission, 
  submitAnswer 
} from "../controllers/contestController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createContest);
router.post('/register/team/:id', isAuthenticated, registerTeam); // New route for team registration
router.get('/getcontests', isAuthenticated, getAllContest);
router.get('/getcontest/:id', isAuthenticated, contestDetails);
router.post('/submit/:id/:questionId', isAuthenticated, submitAnswer); // Updated route to include questionId
router.post('/score/:contestId/:questionId/:teamId', isAuthenticated, scoreSubmission); // Updated route to include questionId
router.get('/mycontests', isAuthenticated, getUserContests);

export default router;
