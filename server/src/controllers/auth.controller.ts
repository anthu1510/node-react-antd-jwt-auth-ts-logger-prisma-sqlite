import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { LoginResponse } from "../types";
import logger from "../config/logger";
import pwdHash from "password-hash";

class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hashedPassword = pwdHash.generate(req.body.password);
      const user = await db.users.create({
        data: { ...req.body, password: hashedPassword },
        omit: { password: true },
      });
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
      const currentUser = await db.users.findUnique({ where: { email } });
      if (!currentUser) {
        throw new Error("email not matched");
      }

      const isVerifyPassword = pwdHash.verify(password, currentUser.password);
      if (!isVerifyPassword) {
        throw new Error("This password is not matched on current email.");
      }
      const loginResponse = {
        success: true,
        accessToken: generateAccessToken({ userId: currentUser?.id }),
        refreshToken: generateRefreshToken({ userId: currentUser?.id }),
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
