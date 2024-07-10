import mongoose from "mongoose";

// Define the schema for a team
const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      }
    ],
    contest: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Contest',
      required: true 
    }
  });
  
  // Create models for Contest and Team
  export const Team = mongoose.model('Team', TeamSchema);