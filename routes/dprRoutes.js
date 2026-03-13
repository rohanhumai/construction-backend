import express from "express";
import { createDPR, getProjectDPR } from "../controllers/dprController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, createDPR);
router.get("/", verifyToken, getProjectDPR);

export default router;
