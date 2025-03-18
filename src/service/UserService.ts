import { LoginRequest, LoginResponse, RegisterRequest } from '../types/types';
import prisma from '../prisma.client';
import bcrypt from 'bcryptjs';
import { JwtUtil } from '../utils/JwtUtil';
import { AppError } from '../utils/AppError';
import { GeneralMessageKey } from '../exception/GeneralMessageKey';
import { UserMessageKey } from '../exception/UserMessageKey';
import { User } from '@prisma/client';

export class UserService {
  public static async login(
    loginRequest: LoginRequest
  ): Promise<LoginResponse> {
    const { usernameOrEmail, password } = loginRequest;

    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      if (!user) {
        throw new AppError(UserMessageKey.USER_NOT_FOUND, 404);
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS, 401);
      }

      const accessToken = JwtUtil.generateAccessToken(user);

      const refreshToken = JwtUtil.generateRefreshToken(user);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public static async register(request: RegisterRequest): Promise<User> {
    const { email, username, password } = request;

    if (
      (await this.isUsernameExist(username)) ||
      (await this.isEmailExist(email))
    ) {
      throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS, 401);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  public static async isUsernameExist(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return !!user;
  }

  public static async isEmailExist(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  public static async logout(usernameOrEmail: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new AppError(UserMessageKey.USER_NOT_FOUND);
    }

    if (!user.refreshToken) {
      throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: null,
      },
    });

    return true;
  }
}
