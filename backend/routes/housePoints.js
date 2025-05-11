import express from 'express';
import { getAllPoints, updatePoints, resetPoints } from '../controllers/housePointsController.js';

const router = express.Router();

// Get all house points
router.get('/', async (req, res) => {
  try {
    const points = await getAllPoints();
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch house points' });
  }
});

// Update house points (admin only)
router.put('/', async (req, res) => {
  try {
    const updates = await updatePoints(req.body);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update house points' });
  }
});

// Reset all house points (admin only)
router.post('/reset', async (req, res) => {
  try {
    const updates = await resetPoints();
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset house points' });
  }
});

export default router;