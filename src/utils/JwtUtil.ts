import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/types';
import { AppError } from './AppError';
import { GeneralMessageKey } from '../exception/GeneralMessageKey';

export class JwtUtil {
  private static JWT_SECRET: string =
    process.env.JWT_SECRET || 'abcdefghijklmnopqrstuvwxyz';

  private static JWT_REFRESH_TOKEN_SECRET: string =
    process.env.JWT_REFRESH_SECRET || 'zyxwvutsrqponmlkjihgfedcba';

  private static JWT_TOKEN_EXPIRY: number = process.env.JWT_EXPIRES_IN
    ? parseInt(process.env.JWT_EXPIRES_IN)
    : 900;

  private static JWT_REFRESH_TOKEN_EXPIRY: number = process.env
    .JWT_REFRESH_EXPIRES_IN
    ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
    : 604800;

  static generateAccessToken(user: User) {
    const payload: UserPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(
      {
        payload,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_TOKEN_EXPIRY, algorithm: 'HS512' }
    );
  }

  static generateRefreshToken(user: User) {
    return jwt.sign({ userId: user.id }, this.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: this.JWT_REFRESH_TOKEN_EXPIRY,
    });
  }

  static validateToken(token: string) {
    try {
      console.log(token, this.JWT_SECRET);

      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new AppError(GeneralMessageKey.INVALID_JWT, 401);
    }
  }
}
