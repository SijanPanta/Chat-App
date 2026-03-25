import "dotenv/config";
import { Server } from "socket.io";

import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import registerMessageHandlers from "./handlers/messageHandler.js";

let io;

const verifyTokenViaRedis = async (token) => {
  // 1. Blacklist check — auth-service writes "blacklist:{token}" on logout
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const cached = await redisClient.get(`user:${decoded.userId}`);
  if (!cached) return null;

  return JSON.parse(cached);
};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // update to your frontend URL
      methods: ["GET", "POST"],
    },
  });

  // Middleware for Authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const user = await verifyTokenViaRedis(token);

      if (!user) {
        return next(
          new Error("Authentication error: Invalid or expired token"),
        );
      }

      socket.user = user;
      return next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return next(new Error("Authentication error: Invalid token"));
      }
      if (error.name === "TokenExpiredError") {
        return next(new Error("Authentication error: Token expired"));
      }
      console.error("[chat-services] Redis auth error:", error);
      return next(new Error("Authentication error: Could not verify token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Register event handlers
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
