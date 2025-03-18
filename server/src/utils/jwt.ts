import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = { userId: number };
export type GenerateToken = (payload: TokenPayload) => string;

export const generateAccessToken: GenerateToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET);
};

export const generateRefreshToken: GenerateToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET);
};
