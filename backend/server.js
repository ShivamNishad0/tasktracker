import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import authMiddleware from './middleware/auth.js'
import cron from 'node-cron'
import { checkAndSendReminders } from './utils/reminderService.js'

import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO DB
connectDB();

// ROUTES

app.get('/', (req, res) => {
    res.send('API is running....');
})
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);

// Schedule the reminder check to run every hour
cron.schedule("0 * * * *", () => {
  console.log("Running scheduled task: checkAndSendReminders");
  checkAndSendReminders();
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
