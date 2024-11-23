import express from 'express';
import dotenv from 'dotenv';
import taskRoute from './routes/taskRoute.js';
import subtaskRoute from './routes/subtaskRoute.js';
import { connectDB, sequelize } from './db/connectDB.js';
import { initModels } from './lib/utils/initModels.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tasks", taskRoute);
app.use("/api/subtasks", subtaskRoute);

const startServer = async () => {
  await connectDB();
  initModels();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);    
  })
}

startServer();