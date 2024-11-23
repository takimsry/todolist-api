import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = await Task.create({ title });

    res.status(201).json(newTask);
  } catch (error) {
    console.log("Error in createTask controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const tasks = await Task.findAll({ where: { status } });

    res.status(200).json(tasks);
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

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in updateTaskTitle controller", error);
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
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in updateTaskStatus controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}