import express from "express";
import projectController from "../../controller/projectController.js";
const router = express.Router();
router.post("/", projectController);
export default router;
