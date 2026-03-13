import "dotenv/config";

import http from "http";
import app from "./app.js";
import db from "./models/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.AUTH_SERVICE_PORT || 4000;
const server = http.createServer(app);

const shutdown = () => {
  console.log('\nStopping auth-service...');
  server.close(() => {
    console.log('Auth-service stopped.');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, async () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);

  try {
    await db.sequelize.authenticate();
    console.log("✅ Auth Service DB connected (shared DB)");
    await connectRedis();
  } catch (err) {
    console.error("❌ Auth Service startup failed:", err);
    process.exit(1);
  }
});
