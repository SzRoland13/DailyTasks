import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

router.get('/username-exists/:username', UserController.isUsernameExist);

router.get('/email-exists/:email', UserController.isEmailExist);

router.get('/test', UserController.test);

router.post('/login', UserController.login);

router.post('/register', UserController.register);

router.post('/logout', UserController.logout);

export default router;
