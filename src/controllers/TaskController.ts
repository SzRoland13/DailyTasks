import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../service/TaskService';
import { PriorityLevel, TaskStatus } from '@prisma/client';

export class TaskController {
  constructor(private taskService: TaskService) {}

  public async getTaskById(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id);
    try {
      const task = await this.taskService.getTaskById(taskId);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  public async getTasksByUserIdPaginated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = Number(res.locals.user?.id);
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const { status, priority, searchValue, searchIn } = req.query;

    try {
      const result = await this.taskService.getTasksByUserIdPaginated(
        userId,
        { page, size },
        {
          status: status as TaskStatus,
          priority: priority as PriorityLevel,
          searchValue: searchValue as string,
          searchIn: searchIn as 'title' | 'description',
        }
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await this.taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  public async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await this.taskService.updateTask(req.body);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  public async deleteTask(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id);
    try {
      const task = await this.taskService.deleteTask(taskId);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  public async isTaskOwner(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.taskId);
    const userId = Number(req.params.userId);
    try {
      const isOwner = await this.taskService.isTaskOwner(userId, taskId);
      res.status(200).json({ isOwner });
    } catch (err) {
      next(err);
    }
  }
}
