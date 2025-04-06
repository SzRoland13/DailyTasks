import type { Request, Response, Express } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import prisma from './prisma.client';
import { exit } from 'process';
import userRoutes from './routes/UserRoutes';
import taskRoutes from './routes/TaskRoutes';
import { errorHandler } from './middleware/ErrorHandler';
import { loggingMiddleware } from './middleware/LoggingMiddleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(loggingMiddleware);

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err: Error, req: Request, res: Response) => {
  errorHandler(err, req, res);
});

app.listen(PORT, async () => {
  console.info(`Server is up and running on ${PORT} port`);

  try {
    await prisma.user.findUnique({
      where: { id: 1 },
    });

    console.info('Database connection was made!');
  } catch (error) {
    console.error('Database error: ', error);
    exit(1);
  }
});
