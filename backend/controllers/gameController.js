import Game from "../models/gameModel.js";
import { v2 as cloudinary } from "cloudinary";

const createGame = async (req, res) => {
  try {
    const { teamA, teamB, startTime, category, description } = req.body;
    
    const newGame = new Game({
      teamA: {
        name: teamA.name,
        logo: teamA.logo || '',
        players: teamA.players || []
      },
      teamB: {
        name: teamB.name,
        logo: teamB.logo || '',
        players: teamB.players || []
      },
      startTime,
      category,
      description,
      status: "upcoming"
    });

    // Add cloudinary upload for teamA logo if provided
    if (teamA.logo) {
      const uploadedLogo = await cloudinary.uploader.upload(teamA.logo, {
        folder: 'game-logos',
        transformation: [{ width: 200, height: 200, crop: 'fill' }]
      });
      newGame.teamA.logo = uploadedLogo.secure_url;
    }

    await newGame.save();
    
    // Real-time update
    req.app.get('io').emit('gameAdded', newGame);
    
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ startTime: -1 })
      .limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Real-time update
    req.app.get('io').emit('gameModified', game);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    
    // Real-time update
    req.app.get('io').emit('gameRemoved', req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all controllers at the bottom
export {
  createGame,
  getGames,
  updateGame,
  deleteGame
};