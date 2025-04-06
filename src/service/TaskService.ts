import type { PrismaClient, Task } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { TaskMessageKey } from '../exception/TaskMessageKey';
import type { PaginationRequest, PaginationResponse } from '../types/GeneralTypes';
import type { TaskCreateRequest, TaskFilter, TaskUpdateRequest } from '../types/TaskTypes';

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  public async getTaskById(taskId: number): Promise<Task> {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id: taskId },
      });

      if (!task) {
        throw new AppError(TaskMessageKey.TASK_NOT_FOUND, 404);
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  public async getTasksByUserIdPaginated(
    userId: number,
    pageable: PaginationRequest,
    filter?: TaskFilter
  ): Promise<PaginationResponse<Task>> {
    const { page, size } = pageable;
    const skip = (page - 1) * size;

    const where: any = {
      authorId: userId,
      ...(filter?.status && { status: filter.status }),
      ...(filter?.priority && { priority: filter.priority }),
    };

    if (filter?.searchValue && filter?.searchIn) {
      where[filter.searchIn] = {
        contains: filter.searchValue,
        mode: 'insensitive',
      };
    }

    const [tasks, totalItems] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      page,
      size: size,
      totalItems,
      totalPages: Math.ceil(totalItems / size),
    };
  }

  public async createTask(request: TaskCreateRequest): Promise<Task> {
    try {
      return await this.prisma.task.create({
        data: {
          title: request.title,
          description: request.description,
          authorId: request.authorId,
          priority: request.priority,
          status: request.status,
          createdAt: request.createdAt,
          dueAt: request.dueAt,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateTask(request: TaskUpdateRequest): Promise<Task> {
    try {
      const { id, ...rest } = request;

      const updateData = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(updateData).length === 0) {
        throw new AppError(TaskMessageKey.NO_VALID_TASK_FIELD_TO_UPDATE, 400);
      }

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: updateData,
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTask(taskId: number): Promise<Task> {
    try {
      return await this.prisma.task.delete({
        where: { id: taskId },
      });
    } catch (error) {
      throw new AppError(TaskMessageKey.TASK_NOT_FOUND, 404);
    }
  }

  public async isTaskOwner(userId: number, taskId: number): Promise<boolean> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, authorId: userId },
    });

    return !!task;
  }
}
