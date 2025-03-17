import { LoginRequest, LoginResponse, RegisterRequest } from '../types/types';
import prisma from '../prisma.client';
import bcrypt from 'bcryptjs';
import { JwtUtil } from '../utils/JwtUtil';

export class UserService {
  public static async login(
    loginRequest: LoginRequest
  ): Promise<LoginResponse> {
    const { usernameOrEmail, password } = loginRequest;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new Error('user.not.found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('invalid.credentials');
    }

    const accessToken = JwtUtil.generateAccessToken(user);

    const refreshToken = JwtUtil.generateRefreshToken(user);

    return { accessToken, refreshToken, user };
  }

  public static async register(request: RegisterRequest) {
    const { email, username, password } = request;

    if (
      (await this.isUsernameExist(username)) ||
      (await this.isEmailExist(email))
    ) {
      throw new Error('invalid.credentials');
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
    const user = prisma.user.findUnique({
      where: { username },
    });

    return !!user;
  }

  public static async isEmailExist(email: string): Promise<boolean> {
    const user = prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }
}
