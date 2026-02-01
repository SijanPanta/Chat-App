import bcrypt from "bcrypt";
import db from "../models/index.js";
import user from "../models/user.js";

const { User } = db;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User is already registered" });
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const newUser=await User.create({
      username,
      email,
      password_hash:hashedPassword
    })

     res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
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
