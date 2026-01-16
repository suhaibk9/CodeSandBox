import express from "express";
import pingController from "../../controller/pingController.js";
const router = express.Router();
router.get("/ping", pingController);
export default router;
