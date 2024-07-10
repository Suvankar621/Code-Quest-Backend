import { Contest } from "../models/Contest.js";
import { Team } from "../models/Team.js";

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
  const { teamName, memberIds } = req.body;
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

    const team = new Team({
      name: teamName,
      members: memberIds,
      contest: contest._id
    });

    await team.save();

    contest.teams.push(team._id);
    await contest.save();

    res.json({ team, message: 'Team successfully registered for the contest' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Register Contest
export const registerContest=async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  const utcTime = now.getTime();
  // IST is UTC + 5:30 (19800 seconds)
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
  if (contest.registeredUsers.includes(req.user._id)) {
    return res.status(400).json({ message: 'User already registered for the contest' });
  }
  
  contest.registeredUsers.push(req.user._id);
  await contest.save();

  res.json({user:req.user, message: 'Successfully registered for the contest' });
} catch (err) {
  res.status(500).send(err.message);
}
}

// Get particular contest details
export const contestDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findById(id).populate('teams').populate('registeredUsers');
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.status(200).json({ contest });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Submit your answer
export const submitAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const now = new Date();
  try {
    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    if (now < new Date(contest.startTime) || now > new Date(contest.endTime)) {
      return res.status(400).json({ message: 'Contest is not active' });
    }
    if (!contest.registeredUsers.includes(req.user._id)) {
      return res.status(403).json({ message: 'User not registered for the contest' });
    }

    const submission = { 
      userId: req.user._id,
      answer: answer,
      submittedAt: now
    };

    contest.submissions.push(submission);
    await contest.save();

    res.json({ message: 'Answer submitted successfully' });
  } catch (err) {
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
export const scoreSubmission = async (req, res) => {
  const { contestId, submissionId } = req.params;
  const { score } = req.body;

  if (score == null || score < 0 || score > 100) { // Example score validation
    return res.status(400).json({ message: 'Score must be between 0 and 100.' });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const submission = contest.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.score = score;
    await contest.save();

    res.json({ message: 'Score submitted successfully', submission });
  } catch (err) {
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
    const contest = await Contest.find({ 'submissions._id': submissionId });

    if (!contest) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const submission = contest.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.answer = answer;
    await contest.save();

    res.status(200).json({ message: "Answer updated successfully", submission });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
