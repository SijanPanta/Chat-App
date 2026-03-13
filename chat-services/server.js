import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.CHAT_SERVICE_PORT || 4001;

const server = http.createServer(app);

// Connect to Redis before starting the server
await connectRedis();

// Initialize Socket.io on the HTTP server
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Chat microservice running on port ${PORT}`);
});

// Graceful shutdown handler
const shutdown = (signal) => {
  console.log(
    `\n[chat-services] Received ${signal}. Shutting down gracefully...`,
  );
  server.close(() => {
    console.log("[chat-services] HTTP server closed. Port 4001 released.");
    process.exit(0);
  });

  // Force shutdown if server hasn't closed in 5 seconds
  setTimeout(() => {
    console.error("[chat-services] Forced shutdown after timeout.");
    process.exit(1);
  }, 5000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
