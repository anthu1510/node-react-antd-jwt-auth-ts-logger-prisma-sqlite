import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { GenerateToken, GenerateTokens } from "../types";

export const generateAccessToken: GenerateToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET);
};

export const generateRefreshToken: GenerateToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET);
};

export const generateTokens: GenerateTokens = (payload) => {
  const result = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
  return result;
};
