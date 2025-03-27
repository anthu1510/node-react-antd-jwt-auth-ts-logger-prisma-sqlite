import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import authController from "../controllers/auth.controller";
import {
  LoginSchema,
  UsersCreateInputSchema,
  RefreskTokenSchema,
} from "../schemas";

const authRouter = Router();

authRouter.post(
  "/create",
  validateRequest({ body: UsersCreateInputSchema }),
  authController.create
);
authRouter.post(
  "/login",
  validateRequest({ body: LoginSchema }),
  authController.login
);
authRouter.get("/", authController.getAll);
authRouter.get(
  "/refresh",
  validateRequest({ body: RefreskTokenSchema }),
  authController.refreskToken
);

export default authRouter;
