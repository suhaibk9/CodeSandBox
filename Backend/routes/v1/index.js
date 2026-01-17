import express from "express";
import pingController from "../../controller/pingController.js";
import projectRouter from "./projects.js";
const router = express.Router();
router.get("/ping", pingController);
router.use("/projects", projectRouter);
export default router;
