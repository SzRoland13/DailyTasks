import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/JwtUtil';
import { UserPayload } from '../types/types';
import { AppError } from '../utils/AppError';
import { GeneralMessageKey } from '../exception/GeneralMessageKey';

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];

  console.log(authHeader);

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
