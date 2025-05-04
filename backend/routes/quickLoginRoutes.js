import express from "express";
import { processQuickLogin } from "../controllers/quickLoginController.js";

const router = express.Router();

// Quick login route
router.get("/quick-login", processQuickLogin);

export default router; 