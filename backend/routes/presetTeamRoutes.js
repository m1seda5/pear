// routes/presetTeamRoutes.js
import express from "express";
import { getPresetTeams } from "../controllers/presetTeamController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
router.get("/presets", protectRoute, getPresetTeams);
export default router;