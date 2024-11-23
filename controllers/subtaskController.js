import Subtask from "../models/subtaskModel.js";
import Task from "../models/taskModel.js";

export const createSubtask = async (req, res) => {
  try {
    const { title, task_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!task_id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const newSubtask = await Subtask.create({ title, task_id });

    res.status(201).json(newSubtask);
  } catch (error) {
    console.log("Error in createSubtask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    let subtask = await Subtask.findByPk(id);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    subtask.title = title || subtask.title;
    subtask = await subtask.save();

    res.status(200).json(subtask);
  } catch (error) {
    console.log("Error in updateSubtask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await Subtask.findByPk(id);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    await Subtask.destroy({ where: { id } });

    res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.log("Error in deleteSubtask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateSubtaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    let subtask = await Subtask.findByPk(id);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    if (subtask.status) {
      subtask.status = false;
    } else {
      subtask.status = true;
    }
    
    subtask = await subtask.save();

    const taskId = subtask.task_id;
    const subtasksUnderTask = await Subtask.findAll({ where: { task_id: taskId } });
    const completedSubtasks = subtasksUnderTask.filter(subtask => subtask.status === true);

    if(subtasksUnderTask.length === completedSubtasks.length) {
      await Task.update({ status: true }, { where: { id: taskId } });
    } else {
      await Task.update({ status: false }, { where: { id: taskId } });
    }

    res.status(200).json(subtask);
  } catch (error) {
    console.log("Error in updateSubtaskStatus controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}