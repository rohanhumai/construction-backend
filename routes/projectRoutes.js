import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import dprRoutes from "./dprRoutes.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "manager"), createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProjectById);
router.put("/:id", verifyToken, authorizeRoles("admin", "manager"), updateProject);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteProject);

router.use("/:id/dpr", dprRoutes);

export default router;
