import Game from '../models/Game.js';

async function getAllGames(req, res) {
  try {
    const games = await Game.find()
      .sort({ startTime: 1 })
      .limit(10);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createGame(req, res) {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateGame(req, res) {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.gameId,
      req.body,
      { new: true }
    );
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateScore(req, res) {
  try {
    const { gameId, teamIndex, score } = req.body;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    game.teams[teamIndex].score = score;
    await game.save();
    
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteGame(req, res) {
  try {
    const game = await Game.findByIdAndDelete(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getGameState(req, res) {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const now = new Date();
    let state;
    if (now < game.startTime) {
      state = 'upcoming';
    } else if (now > game.endTime) {
      state = (now - game.endTime < 86400000) ? 'final' : 'expired';
    } else {
      state = 'live';
    }
    
    res.status(200).json({ state });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  getAllGames,
  createGame,
  updateGame,
  updateScore,
  deleteGame,
  getGameState
};