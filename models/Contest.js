import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, default: null }
});

// Define the schema for a submission
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // answer: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  scores: [ScoreSchema],
  file: { type: String } 
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
  submission: SubmissionSchema
});

// Define the schema for a contest
const ContestSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  questions: [
    {
      questionText: { 
        type: String, 
        required: true 
      }
    }
  ],
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
