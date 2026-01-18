import express from "express";
import {
  projectController,
  getProjectTree,
} from "../../controller/projectController.js";

const router = express.Router();
router.post("/", projectController);
router.get("/:projectId/tree", getProjectTree);

export default router;
