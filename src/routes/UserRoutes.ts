import express from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/JwtMiddleware';
import { UserService } from '../service/UserService';
import prisma from '../prisma.client';

const router = express.Router();

const userService = new UserService(prisma);
const userController = new UserController(userService);

router.get('/username-exists/:username', userController.isUsernameExist);

router.get('/email-exists/:email', userController.isEmailExist);

router.get('/test', userController.test);

router.post('/login', userController.login);

router.post('/register', userController.register);

router.post('/logout', userController.logout);

router.post('/profile', authenticateToken, userController.getUserProfile);

export default router;
