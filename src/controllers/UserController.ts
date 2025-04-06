import { GeneralMessageKey } from '../exception/GeneralMessageKey';
import type { UserService } from '../service/UserService';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { UserMessageKey } from '../exception/UserMessageKey';

export class UserController {
  constructor(private userService: UserService) {}

  public test(req: Request, res: Response): void {
    res.send('User route works!');
  }

  public async isUsernameExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exists = await this.userService.isUsernameExist(req.params.username);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  }

  public async isEmailExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exists = await this.userService.isEmailExist(req.params.email);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS, 401);
      }

      const payload = await this.userService.login({
        usernameOrEmail,
        password,
      });

      res.status(200).json({ payload });
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS);
      }

      const user = await this.userService.register({
        email,
        username,
        password,
      });

      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { usernameOrEmail } = req.body;

      if (!usernameOrEmail) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS);
      }

      const logoutSuccessful = await this.userService.logout(usernameOrEmail);

      res.status(200).json({ logoutSuccessful });
    } catch (error) {
      next(error);
    }
  }

  public async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user.userId;

      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new AppError(UserMessageKey.USER_NOT_FOUND, 404);
      }

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
