import http from "http";
import app from "./app";
import logger from "./config/logger";
import { env } from "./config/env";

const PORT = env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
