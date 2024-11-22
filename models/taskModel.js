import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectDB.js';

const Task = sequelize.define('Task', {
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
  deadline: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

export default Task;