import Subtask from "../models/subtaskModel.js";
import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({ title });
    
    const formattedTask = { ...task.dataValues, Subtasks: [], progressPercentage: 0 };
    res.status(201).json(formattedTask);
  } catch (error) {
    console.log("Error in createTask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const tasks = await Task.findAll({
      include: { model: Subtask },
      where: { status },
      order: [['deadline', 'ASC'], ['updatedAt', 'ASC']]
    });

    const formattedTasks = tasks.map(task => {
      let progressPercentage = 0;

      if (task.status) {
        progressPercentage = 100;
      } else {
        const subtasksUnderTask = task.Subtasks;
        const completedSubtasks = subtasksUnderTask.filter(subtask => subtask.status === true);
        progressPercentage = Math.round((completedSubtasks.length / subtasksUnderTask.length) * 100);
      }
      
      return {
        ...task.dataValues,
        progressPercentage: progressPercentage || 0
      }
    });

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.log("Error in getTasks controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.destroy({ where: { id } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log("Error in deleteTask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, deadline } = req.body;

    let task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.title = title || task.title;
    task.deadline = deadline || task.deadline;
    task = await task.save();

    const subtasksUnderTask = await Subtask.findAll({ where: { task_id: id } });
    let progressPercentage = 0;
    if (task.status) {
      progressPercentage = 100;
    } else {
      const completedSubtasks = subtasksUnderTask.filter(subtask => subtask.status === true);
      progressPercentage = Math.round((completedSubtasks.length / subtasksUnderTask.length) * 100);
    }

    const formattedTask = { ...task.dataValues, Subtasks: subtasksUnderTask || [], progressPercentage: progressPercentage || 0 };
    res.status(200).json(formattedTask);
  } catch (error) {
    console.log("Error in updateTask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    let task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status) {
      task.status = false;
    } else {
      task.status = true;
    }
    
    task = await task.save();

    if (task.status) {
      await Subtask.update({ status: true }, { where: { task_id: id } });
    } else {
      await Subtask.update({ status: false }, { where: { task_id: id } });
    }

    const subtasksUnderTask = await Subtask.findAll({ where: { task_id: id } });
    let progressPercentage = 0;
    if (task.status) {
      progressPercentage = 100;
    } else {
      const completedSubtasks = subtasksUnderTask.filter(subtask => subtask.status === true);
      progressPercentage = Math.round((completedSubtasks.length / subtasksUnderTask.length) * 100);
    }

    const formattedTask = { ...task.dataValues, Subtasks: subtasksUnderTask || [], progressPercentage: progressPercentage || 0 };
    res.status(200).json(formattedTask);
  } catch (error) {
    console.log("Error in updateTaskStatus controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}