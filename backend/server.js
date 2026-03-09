import "dotenv/config";
import http from "http";
import app from "./app.js";
import sequelize from "./config/db.js";
import { connectRedis } from "./config/redis.js";
const PORT = process.env.PORT || 3030;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await connectRedis();
    
  } catch (err) {
    console.error("Startup connection failed:", err);
  }
});
