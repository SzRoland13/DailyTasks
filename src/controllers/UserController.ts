import { GeneralMessageKey } from '../exception/GeneralMessageKey';
import { UserService } from '../service/UserService';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export class UserController {
  public static test(req: Request, res: Response) {
    res.send('User route works!');
  }

  public static async isUsernameExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const exists = await UserService.isUsernameExist(req.params.username);

      console.log(exists);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  }

  public static async isEmailExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const exists = await UserService.isEmailExist(req.params.email);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS, 401);
      }

      const payload = await UserService.login({ usernameOrEmail, password });

      res.status(200).json({ payload });
    } catch (error) {
      next(error);
    }
  }

  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS);
      }

      const user = await UserService.register({ email, username, password });

      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { usernameOrEmail } = req.body;

      if (!usernameOrEmail) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS);
      }

      const logoutSuccessful = await UserService.logout(usernameOrEmail);

      res.status(200).json({ logoutSuccessful });
    } catch (error) {
      next(error);
    }
  }
}
