import express, { Request, Response, Express, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import prisma from './prisma.client';
import { exit } from 'process';
import userRoutes from './routes/UserRoutes';
import { errorHandler } from './middleware/ErrorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, async () => {
  console.log(`Server is up and running on ${PORT} port`);

  try {
    await prisma.user.findUnique({
      where: { id: 1 },
    });

    console.log('Database connection was made!');
  } catch (error) {
    console.error('Database error: ', error);
    exit(1);
  }
});
