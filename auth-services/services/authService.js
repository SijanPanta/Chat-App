import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import redisClient from "../config/redis.js";

const { User } = db;
const USER_CACHE_TTL = 3600; // 1 hour

export const hashPassword = async (password) => bcrypt.hash(password, 10);

export const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const createUser = async (username, email, password, role) => {
  const password_hash = await hashPassword(password);
  return User.create({ username, email, password_hash, role });
};

export const findUserByEmail = async (email) =>
  User.findOne({ where: { email } });

export const findUserById = async (userId) => {
  const cacheKey = `user:${userId}`;

  // 1. Check Redis cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — fetch from DB
  const user = await User.findByPk(userId);
  if (user) {
    await redisClient.setEx(cacheKey, USER_CACHE_TTL, JSON.stringify(user));
  }

  return user;
};

export const invalidateSession = async (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) return;

  // Blacklist the token for its remaining lifetime
  const ttl = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;

  if (ttl > 0) {
    await redisClient.setEx(`blacklist:${token}`, ttl, "1");
  }

  // Clear user cache so stale data is not served
  await redisClient.del(`user:${decoded.userId}`);
};

// Called by the main app whenever a user's data is mutated (profile pic, password, etc.)
export const clearUserCache = async (userId) => {
  await redisClient.del(`user:${userId}`);
};

// Called by GET /auth/verify — used by the main app's authenticate middleware
export const verifyAndGetUser = async (token) => {
  // 1. Blacklist check
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) return null;

  // 2. Verify signature + expiry (throws if invalid)
  const decoded = verifyToken(token);

  // 3. Return user (from cache or DB)
  return findUserById(decoded.userId);
};
