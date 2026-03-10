import "dotenv/config";

import http from "http";
import app from "./app.js";
import db from "./models/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.AUTH_SERVICE_PORT || 4000;
const server = http.createServer(app);

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
