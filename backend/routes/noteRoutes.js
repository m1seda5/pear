import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", protectRoute, getNotes);
router.post("/", protectRoute, createNote);
router.put("/:id", protectRoute, updateNote);
router.delete("/:id", protectRoute, deleteNote);

export default router; 