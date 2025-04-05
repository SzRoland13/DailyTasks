import { Request, Response, NextFunction } from 'express';
import logger from '../utils/Logger';

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  logger.info(`Request: ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info(
      `Response: ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`
    );
  });

  next();
}
