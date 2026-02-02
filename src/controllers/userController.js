import db from "../models/index.js";
const { User } = db;
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json({ message: `Get user ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    res
      .status(200)
      .json({ message: `Update user of ${id} to ${name} and ${age}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement delete user logic
    res.status(200).json({ message: `Delete user ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
