import mongoose from "mongoose";

// Define the schema for scores within a submission
const ScoreSchema = new mongoose.Schema({
  score1: { type: Number, default: null },
  score2: { type: Number, default: null },
  score3: { type: Number, default: null },
  score4: { type: Number, default: null }
});

// Define the schema for a submission
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, default: Date.now },
  scores: ScoreSchema,  // Use the ScoreSchema directly for scores
  file: {
    url: { type: String, required: true }, // Store file URL
  }
});

// Define the schema for a team member
const TeamMemberSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

// Define the schema for a team
const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [TeamMemberSchema],
});

// Define the schema for a question
const QuestionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  },
  submissions: [SubmissionSchema]  // Submissions for each question
});

// Define the schema for a contest
const ContestSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  questions: [QuestionSchema],  // Each question has its own submissions
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  registeredTeams: [TeamSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

export const Contest = mongoose.model('Contest', ContestSchema);
export const Team = mongoose.model('Team', TeamSchema);
export const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);
export const Submission = mongoose.model('Submission', SubmissionSchema);
export const Question = mongoose.model('Question', QuestionSchema);
