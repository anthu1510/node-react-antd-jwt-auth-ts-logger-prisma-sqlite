import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { generateTokens } from "../utils/jwt";
import { TLoginResponse } from "../types";
import logger from "../config/logger";
import pwdHash from "password-hash";
import jwt from "jsonwebtoken";

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
  async login(req: Request, res: Response<TLoginResponse>, next: NextFunction) {
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
        ...generateTokens({ userId: currentUser?.id }),
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

  async refreskToken(
    req: Request<{ refreshToken: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ message: error.message });
        next(error); // Pass error to middleware
      }
    }
  }
}

export default new AuthController();
