import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User } = db;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    res
      .status(201)
      .json({
        message: `name:${username},email:${email},password:${password}`,
      });

    // res.status(201).json({ message:  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: Implement login logic
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // TODO: Implement logout logic
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
