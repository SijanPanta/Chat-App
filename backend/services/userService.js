import db from "../models/index.js";

const { User } = db;

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password_hash"] },
  });
};

export const getUserById = async (userId) => {
  const user = await User.findOne({
    where: {
      userId,
    },
  });
  // console.log(user);
  return user;
};

export const updateUserById = async (userId, updateData) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    throw new Error("User not found");
  }
  return await user.update(updateData);
};

export const deleteUserById = async (userId) => {
  // console.log("inside delete service");
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    throw new Error("User not found");
  }
  return await user.destroy();
};

export const searchUser = async (q) => {
  const { Op } = db.Sequelize;
  const users = await User.findAll({
    where: {
      username: {
        [Op.like]: `${q}%`,
      },
    },
    attributes: { exclude: ["password_hash"] },
  });
  return users;
};
