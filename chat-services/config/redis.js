import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) =>
  console.error("❌ [chat-services] Redis Error:", err),
);

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("✅ [chat-services] Redis connected successfully");
};

export default redisClient;
