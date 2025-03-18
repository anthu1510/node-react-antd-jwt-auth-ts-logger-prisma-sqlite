// import { Response, ErrorRequestHandler } from "express";
// import { z } from "zod";
// import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
// import AppError from "../utils/appError";
// import logger from "../config/logger";

// const handleZodError = (res: Response, error: z.ZodError) => {
//   const errors = error.issues.map((err) => ({
//     path: err.path.join("."),
//     message: err.message,
//   }));

//   return res.status(BAD_REQUEST).json({
//     errors,
//     message: error.message,
//   });
// };

// const handleAppError = (res: Response, error: AppError) => {
//   return res.status(error.statusCode).json({
//     message: error.message,
//     errorCode: error.errorCode,
//   });
// };

// const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
//   logger.error(`Error: ${error.message}`);

//   if (error instanceof z.ZodError) {
//     handleZodError(res, error);
//     return; // Ensure void return
//   }

//   if (error instanceof AppError) {
//     handleAppError(res, error);
//     return; // Ensure void return
//   }

//   if (!res.headersSent) {
//     res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
//     res.render("error", { error: error }); // Ensure this executes properly
//   }

//   return; // Explicit return to satisfy TypeScript
// };

// export default errorHandler;

import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import logger from "../config/logger";

// Custom Error Interface
interface CustomError extends Error {
  status?: number;
}

// Centralized Error Handler Middleware
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  logger.error(`Error: ${message}`);

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
