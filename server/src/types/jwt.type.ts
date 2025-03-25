export type TokenPayload = { userId: number };

export type GenerateToken = (payload: TokenPayload) => string;

export type GenerateTokens = (payload: TokenPayload) => TGenerateTokens;

export type VerifyRefreshToken = (refreshToken: string) => boolean;

export type TGenerateTokens = {
  accessToken: string;
  refreshToken: string;
};
