// routes/gameRoutes.js
import express from "express";
import { createGame, getGames, updateGame } from "../controllers/gameController.js";
import protectRoute from "../middlewares/protectRoute.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { gameUpdateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.put("/:id", protectRoute, adminMiddleware, gameUpdateLimiter, updateGame);
router.post("/", protectRoute, adminMiddleware, createGame);
router.get("/", getGames);

export default router;