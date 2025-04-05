import { PriorityLevel, TaskStatus } from '@prisma/client';

export type TaskCreateRequest = {
  title: string;
  description: string;
  priority?: PriorityLevel;
  status?: TaskStatus;
  authorId: number;
  createdAt?: Date;
  dueAt?: Date;
};

export type TaskUpdateRequest = {
  id: number;
  title?: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TaskStatus;
  dueAt?: Date;
};

export type TaskFilter = {
  status?: TaskStatus;
  priority?: PriorityLevel;
  searchIn?: 'title' | 'description';
  searchValue?: string;
};
