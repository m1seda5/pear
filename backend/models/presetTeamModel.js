// models/presetTeamModel.js
import mongoose from "mongoose";

const presetTeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: String,
  players: [String],
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const PresetTeam = mongoose.model('PresetTeam', presetTeamSchema);
export default PresetTeam;

