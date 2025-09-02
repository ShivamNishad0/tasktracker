import express from 'express';
import authMiddleware from '../middleware/auth.js';

import { getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
 } from '../controllers/taskController.js';


const taskRouter = express.Router();

// Example route to get all tasks (you can modify this as needed)
taskRouter.route('/gp')
.get(authMiddleware,getTasks)
.post(authMiddleware,createTask);
taskRouter.route('/:id/gp')
.get(authMiddleware,getTaskById)
.put(authMiddleware,updateTask)
.delete(authMiddleware,deleteTask);

export default taskRouter;
