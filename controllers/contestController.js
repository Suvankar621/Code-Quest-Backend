import { Contest, Team, TeamMember, Submission } from "../models/Contest.js"; // Adjust the path if necessary
import { User } from "../models/user.js";
import multer from 'multer';
import path from 'path';

// Create Contest
export const createContest = async (req, res) => {
  const { title, questions, startTime, endTime } = req.body;
  try {
    const newContest = new Contest({
      title,
      questions: questions.map(question => ({ questionText: question })),
      startTime,
      endTime,
      createdBy: req.user._id
    });

    if (req.user.role === "Organizer") {
      await newContest.save();
    }

    res.json(newContest);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Register Team for Contest
export const registerTeam = async (req, res) => {
  const { id } = req.params;
  const { teamName, members } = req.body;
  const now = new Date();
  const utcTime = now.getTime();
  const istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
  const istTime = new Date(utcTime + istOffset);

  try {
    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    if (istTime < new Date(contest.startTime) || istTime > new Date(contest.endTime)) {
      return res.status(400).json({ message: 'Registration is not open' });
    }

    const teamMembers = [];
    for (const member of members) {
      const user = await User.findOne({ email: member.email });
      if (!user) {
        return res.status(400).json({ message: `User with email ${member.email} not found` });
      }
      if (contest.registeredTeams.some(team => team.members.some(m => m.email === member.email))) {
        return res.status(400).json({ message: `User with email ${member.email} is already registered` });
      }

      teamMembers.push(new TeamMember({
        email: member.email,
      }));
    }

    const team = new Team({
      teamName: teamName,
      teamLeader: req.user._id,
      members: teamMembers,
    });

    contest.registeredTeams.push(team);
    await contest.save();

    res.json({ team, message: 'Team successfully registered for the contest' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get particular contest details
export const contestDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findById(id)
      .populate({
        path: 'registeredTeams',
        populate: {
          path: 'members.userId',
          model: 'User'
        }
      })
      .populate('createdBy'); // Populate the createdBy field with User details if needed
      
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json({ contest });
  } catch (err) {
    console.error('Error fetching contest details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit Answer
export const submitAnswer = async (req, res) => {
  const { id, questionId } = req.params;
  const now = new Date();
  const { fileUrl } = req.body; // Assuming fileUrl is sent from frontend containing Cloudinary URL

  try {
    // Check if contest exists and is active
    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    if (now < new Date(contest.startTime) || now > new Date(contest.endTime)) {
      return res.status(400).json({ message: 'Contest is not active' });
    }

    // Find the team to associate the submission with
    let team = null;
    for (const regTeam of contest.registeredTeams) {
      if (regTeam.teamLeader.equals(req.user._id)) {
        team = regTeam;
        break;
      }
    }
    if (!team) {
      return res.status(403).json({ message: 'User not registered in any team for the contest' });
    }

    // Find the question to associate the submission with
    const question = contest.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create a new submission document
    const submission = {
      userId: req.user._id,
      submittedAt: now,
      file: {
        url: fileUrl, // Store file URL from Cloudinary
       
      }
    };

    // Save submission to database and update question
    question.submissions.push(submission);
    await contest.save();

    res.json({ message: 'File submitted successfully', submission });
  } catch (err) {
    console.error('Submission Error:', err);
    res.status(500).send(err.message);
  }
};


// Get all contests
export const getAllContest = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.status(200).json({ contests });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Judge Submit Score
// Judge Submit Score
export const scoreSubmission = async (req, res) => {
  const { contestId, questionId, submissionId } = req.params;
  const { score1, score2, score3, score4 } = req.body; // Assuming score fields are sent from frontend

  // Validate score values
  if (score1 == null || score2 == null || score3 == null || score4 == null ||
      score1 < 0 || score1 > 100 || score2 < 0 || score2 > 100 ||
      score3 < 0 || score3 > 100 || score4 < 0 || score4 > 100) {
    return res.status(400).json({ message: 'Scores must be between 0 and 100.' });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const question = contest.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const submission = question.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update scores in the submission
    submission.scores = {
      score1,
      score2,
      score3,
      score4
    };

    await contest.save();

    res.json({ message: 'Score submitted successfully', submission });
  } catch (err) {
    console.error('Score Submission Error:', err);
    res.status(500).send(err.message);
  }
};


// Get contests created by a user
export const getUserContests = async (req, res) => {
  try {
    const contests = await Contest.find({ createdBy: req.user._id }); // Assuming the creator field in the Contest model references the user who created the contest
    if (!contests) {
      return res.status(404).json({ message: 'No contests found' });
    }
    res.status(200).json({ success: true, contests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Contest
export const UpdateContest = async (req, res) => {
  const { submissionId } = req.params;
  const { answer } = req.body;

  try {
    const contest = await Contest.findOne({ 'questions.submissions._id': submissionId });

    if (!contest) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const question = contest.questions.find(question => question.submissions.id(submissionId));

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const submission = question.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.answer = answer; // Assuming the submission schema includes an answer field
    await contest.save();

    res.status(200).json({ message: "Answer updated successfully", submission });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
