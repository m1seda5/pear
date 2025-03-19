// groupRoutes.js
import express from "express";
import { createGroup, getGroups } from "../controllers/groupController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/my-groups", protectRoute, getGroups);

export default router;