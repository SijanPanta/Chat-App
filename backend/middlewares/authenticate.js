import * as authService from "../services/authService.js";
import redisClient from "../config/redis.js";
const USER_CACHE_TTL = 3600;

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const isBlackListed = await redisClient.get(`blacklist:${token}`);
    if (isBlackListed) {
      return res
        .status(401)
        .json({ error: "Token has been invalidated. Please log in again." });
    }

    const decoded = authService.verifyToken(token);
    const cacheKey = `user:${decoded.userId}`;

    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      console.log('===============================================redis activated')
      req.user = JSON.parse(cachedUser);
      return next();
    }

    const user = await authService.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    await redisClient.setEx(cacheKey, USER_CACHE_TTL, JSON.stringify(user));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: error.message });
  }
};
