import { $Enums, User } from '@prisma/client';

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export type UserPayload = {
  userId: number;
  username: string;
  email: string;
  role: $Enums.UserRole;
};
