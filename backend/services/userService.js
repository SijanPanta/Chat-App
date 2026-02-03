import db from "../models/index.js";

const { User } = db;

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password_hash"] },
  });
};

export const getUserById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
  });
};

export const updateUserById = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return await user.update(updateData);
};

export const deleteUserById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return await user.destroy();
};

