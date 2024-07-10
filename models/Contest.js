import mongoose from "mongoose";

// Define the schema for a submission
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  score: { type: Number, default: null }
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
  registeredUsers: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  submissions: [SubmissionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  ]
});


export const Contest = mongoose.model('Contest', ContestSchema);

