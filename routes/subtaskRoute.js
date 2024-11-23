import express from "express";
import { createSubtask, deleteSubtask, updateSubtask, updateSubtaskStatus } from "../controllers/subtaskController.js";

const router = express.Router();

router.post("/", createSubtask);
router.put("/:id", updateSubtask);
router.delete("/:id", deleteSubtask);
router.put("/status/:id", updateSubtaskStatus);

export default router;