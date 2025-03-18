import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { LoginResponse } from "../../prisma/interfaces";
import logger from "../config/logger";

class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await db.users.create({ data: { ...req.body } });
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ message: error.message });
        next(error); // Pass error to middleware
      }
    }
  }
  async login(req: Request, res: Response<LoginResponse>, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const users = await db.users.findUnique({ where: { email, password } });
      if (!users) {
        throw new Error("email password not matched");
      }
      const loginResponse = {
        success: true,
        accessToken: generateAccessToken({ userId: users?.id }),
        refreshToken: generateRefreshToken({ userId: users?.id }),
      };
      logger.info("login users");
      res.json(loginResponse);
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ message: error.message });
        next(error); // Pass error to middleware
      }
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await db.users.findMany({ omit: { password: true } });
      res.json(users);
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ message: error.message });
        next(error); // Pass error to middleware
      }
    }
  }
}

export default new AuthController();
