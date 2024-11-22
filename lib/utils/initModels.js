import Task from '../../models/taskModel.js';
import Subtask from '../../models/subtaskModel.js';

export const initModels = () => {
  Task.hasMany(Subtask, { foreignKey: 'task_id' });
  Subtask.belongsTo(Task, { foreignKey: 'task_id' });
};