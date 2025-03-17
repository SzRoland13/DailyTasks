import express, { Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import prisma from './prisma.client';
import { exit } from 'process';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
  res.status(200).send('Server is up and running!');
});

app.get('/db-test/:id', async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid ID' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404).json({ message: `User with ${id} id not found!` });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Database error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
