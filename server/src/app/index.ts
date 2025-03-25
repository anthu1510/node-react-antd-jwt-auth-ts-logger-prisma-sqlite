import express from "express";
import cors from "cors";
//import session from "express-session";
import { router } from "../routes";
import errorHandler from "../middlewares/errorHandler";
import requestLogger from "../middlewares/requestLogger";
import logger from "../config/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );

// routes
router(app);

// Handle unknown routes
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Not Found" });
});

//errorHandler
app.use(errorHandler);

export default app;
