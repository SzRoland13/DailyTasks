import express from 'express';
import { TaskService } from '../service/TaskService';
import prisma from '../prisma.client';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/JwtMiddleware';

const router = express.Router();

const taskService = new TaskService(prisma);
const taskController = new TaskController(taskService);

router.get('/:id', authenticateToken, taskController.getTaskById);

router.get('/', authenticateToken, taskController.getTasksByUserIdPaginated);

router.post('/', authenticateToken, taskController.createTask);

router.put('/', authenticateToken, taskController.updateTask);

router.delete('/:id', authenticateToken, taskController.deleteTask);

export default router;
