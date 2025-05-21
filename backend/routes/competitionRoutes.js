import express from "express";
import {
  getCompetitionState,
  toggleDevMode,
  toggleHalvePoints,
  endCompetition,
  resetCompetition,
  toggleCompetitionMode
} from "../controllers/competitionController.js";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/state", getCompetitionState);
router.post("/toggle-dev", toggleDevMode);
router.post("/toggle-halved", toggleHalvePoints);
router.post("/end", endCompetition);
router.post("/reset", resetCompetition);
router.post("/toggle-active", toggleCompetitionMode);

// Serve ranked ruleset config
router.get("/ruleset", (req, res) => {
  const rulesetPath = path.join(__dirname, "../config/rankedRuleset.json");
  fs.readFile(rulesetPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load ruleset" });
    res.json(JSON.parse(data));
  });
});

export default router; 