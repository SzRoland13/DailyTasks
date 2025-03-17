import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/JwtUtil';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UserPayload } from '../types/types';

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'invalid.request.unauthorized' });
  }

  try {
    const decoded = JwtUtil.validateToken(token);

    if (!decoded) {
      return res.status(403).json({ message: 'forbidden.request' });
    }

    res.locals.user = decoded as UserPayload;

    next();
  } catch (error: JsonWebTokenError | any) {
    const message = error.message || 'invalid.request.unauthorized';

    return res.status(401).json({ message: message });
  }
}
