// controllers/presetTeamController.js
import PresetTeam from "../models/presetTeamModel.js";

export const getPresetTeams = async (req, res) => {
  try {
    const teams = await PresetTeam.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};