import express from 'express';
import { getAllPoints, updatePoints, resetPoints } from '../controllers/housePointsController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const points = await getAllPoints();
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch house points' });
  }
});

router.put('/', protectRoute, adminMiddleware, async (req, res) => { // Admin-only
  try {
    const updates = await updatePoints(req.body);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update house points' });
  }
});

router.post('/reset', protectRoute, adminMiddleware, async (req, res) => { // Admin-only
  try {
    const updates = await resetPoints();
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset house points' });
  }
});

export default router; 