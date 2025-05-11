const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await gameController.getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Create new game (admin only)
router.post('/', async (req, res) => {
  try {
    const game = await gameController.createGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Update game (admin only)
router.put('/:id', async (req, res) => {
  try {
    const game = await gameController.updateGame(req.params.id, req.body);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Update game score (admin only)
router.patch('/:id/score', async (req, res) => {
  try {
    const { teamIndex, score } = req.body;
    const game = await gameController.updateScore(req.params.id, teamIndex, score);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Delete game (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await gameController.deleteGame(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

module.exports = router; 