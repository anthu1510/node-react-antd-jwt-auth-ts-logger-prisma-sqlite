export * from "./generated";
import { z } from "zod";
import { TLogin } from "../types";

export const LoginSchema: z.ZodType<TLogin> = z
  .object({
    email: z.string().email().min(1).max(512),
    password: z.string().min(1).max(512),
  })
  .strict();
