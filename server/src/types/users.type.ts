import type { Users } from "@prisma/client";

export type TLoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TFindManyUsers = Omit<Users, "password">;

export type TCreateUserResponse = Omit<
  Users,
  "password" | "createdAt" | "updatedAt"
>;

export type TRefreshToken = {
  refreshToken: string;
};
