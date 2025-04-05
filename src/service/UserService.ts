import bcrypt from 'bcryptjs';
import { JwtUtil } from '../utils/JwtUtil';
import { AppError } from '../utils/AppError';
import { GeneralMessageKey } from '../exception/GeneralMessageKey';
import { UserMessageKey } from '../exception/UserMessageKey';
import { PrismaClient, User } from '@prisma/client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/UserTypes';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { usernameOrEmail, password } = loginRequest;

    try {
      const user = await this.prisma.user.findFirst({
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

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      return { accessToken, refreshToken, user };
    } catch (error) {
      throw error;
    }
  }

  public async register(request: RegisterRequest): Promise<User> {
    const { email, username, password } = request;

    if (
      (await this.isUsernameExist(username)) ||
      (await this.isEmailExist(email))
    ) {
      throw new AppError(GeneralMessageKey.INVALID_CREDENTIALS, 401);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  public async isUsernameExist(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return !!user;
  }

  public async isEmailExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  public async logout(usernameOrEmail: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
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

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: null,
      },
    });

    return true;
  }

  public async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
