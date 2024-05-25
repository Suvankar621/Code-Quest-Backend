import mongoose from "mongoose";


const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    
  });
const ContestSchema = new mongoose.Schema ({
  title: { 
    type: String, 
    required: true },
  startTime: { 
    type: Date, 
    required: true },
  endTime: { 
    type: Date, 
    required: true 
},
registeredUsers: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

submissions: [SubmissionSchema]
});

export const Contest= mongoose.model('Contest', ContestSchema);
