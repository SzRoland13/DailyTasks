import type { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export function errorHandler(err: unknown, req: Request, res: Response): void {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });

    return;
  }

  res.status(500).json({ message: 'internal.server.error' });
}
