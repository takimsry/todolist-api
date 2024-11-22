import express from "express";
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from "../controllers/taskController.js";

const router = express.Router();

router.post("/create", createTask);
router.get("/tasks", getTasks);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.put("/status/:id", updateTaskStatus);

export default router;