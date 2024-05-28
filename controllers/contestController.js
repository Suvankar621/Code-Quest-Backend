import { Contest } from "../models/Contest.js";

// Create Contest
export const createContest=async (req, res) => {
    const { title, startTime, endTime } = req.body;
    try {
        const newContest = await new Contest({ title, startTime, endTime });
        if(req.user.role==="Organizer"){
            
            await newContest.save();
        }
      
      res.json(newContest);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
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
export const getAllContest=async(req,res)=>{
    const contests= await Contest.find();

    res.status(200).json({
        contests
    })


}