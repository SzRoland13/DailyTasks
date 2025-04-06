import type { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/JwtUtil';
import { AppError } from '../utils/AppError';
import { GeneralMessageKey } from '../exception/GeneralMessageKey';
import type { UserPayload } from '../types/UserTypes';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(GeneralMessageKey.INVALID_REQUEST, 401);
  }

  try {
    const decoded = JwtUtil.validateToken(token);

    if (!decoded) {
      throw new AppError(GeneralMessageKey.FORBIDDEN_REQUEST, 403);
    }

    res.locals.user = decoded as UserPayload;

    next();
  } catch (error) {
    next(error);
  }
}
