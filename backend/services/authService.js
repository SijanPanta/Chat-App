import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const createUser = async (username, email, password) => {
  const hashedPassword = await hashPassword(password);
  return await User.create({
    username,
    email,
    password_hash: hashedPassword,
  });
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
  });
};
