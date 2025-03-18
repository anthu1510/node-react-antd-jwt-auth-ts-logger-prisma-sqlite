import morgan from "morgan";
import logger from "../config/logger";

// Middleware using Morgan to log HTTP requests
const requestLogger = morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

export default requestLogger;
