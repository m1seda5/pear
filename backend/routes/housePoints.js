const express = require('express');
const router = express.Router();
const housePointsController = require('../controllers/housePointsController');

// Get all house points
router.get('/', async (req, res) => {
  try {
    const points = await housePointsController.getAllPoints();
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch house points' });
  }
});

// Update house points (admin only)
router.put('/', async (req, res) => {
  try {
    const updates = await housePointsController.updatePoints(req.body);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update house points' });
  }
});

// Reset all house points (admin only)
router.post('/reset', async (req, res) => {
  try {
    const updates = await housePointsController.resetPoints();
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset house points' });
  }
});

module.exports = router; 