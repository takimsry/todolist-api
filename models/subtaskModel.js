import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectDB.js';

const Subtask = sequelize.define('Subtask', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  task_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Tasks',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Subtask;