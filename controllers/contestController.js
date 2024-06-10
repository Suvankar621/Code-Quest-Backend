import { Contest } from "../models/Contest.js";

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
// get particular contest details
export const contestDetails=async(req,res)=>{
  const { id } = req.params;
try {
  const contest = await Contest.findById(id);
  if (!contest) {
    return res.status(404).json({ message: 'Contest not found' });
  }
  if (contest.registeredUsers.includes(req.user._id)) {
    return res.status(200).json({contest,registeredUser:contest.registeredUsers});
  }
  res.status(200).json({contest})
  
} catch (err) {
  res.status(500).send(err.message);
}
}
// Submit your answer
export const submitAnswer=async (req, res) => {
    const { id } = req.params;
    // const { answer,submissionFiles } = req.body;
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
  }
// get all Contest
export const getAllContest = async (req, res) => {
  try {
      // Filter contests based on createdBy field to retrieve only the contests created by the authenticated user
      // const contests = await Contest.find({ createdBy: req.user._id });
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
// 1 user created all contest
export const getUserContests = async (req, res) => {
  try {
      const contests = await Contest.find({ createdBy: req.user._id }); // Assuming the creator field in the Contest model references the user who created the contest

      if (!contests) {
          return res.status(404).json({ message: 'No contests found' });
      }

      res.status(200).json({
          success: true,
          contests
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};
// Update Contest
export const UpdateContest = async (req, res) => {
  const { submissionId } = req.params;
  const { answer } = req.body;

  try {
    // Find the contest that contains the submission
    const contest = await Contest.findOne({ 'submissions._id': submissionId });

    if (!contest) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Find the specific submission within the contest's submissions array
    const submission = contest.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update the answer
    submission.answer = answer;

    // Save the contest (which includes the updated submission)
    await contest.save();

    res.status(200).json({ message: "Answer updated successfully", submission });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};