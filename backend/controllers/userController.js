import * as userService from "../services/userService.js";
import path from "path";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get("host")}${profilePicturePath}`;

    const updatedUser = await userService.updateUserById(id, {
      profilePicture: profilePicturePath,
    });

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
      url: fullUrl,
      profilePicture: profilePicturePath,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUserById(id, {
      profilePicture: null,
    });

    res.status(200).json({ message: "profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUserById(id, updateData);
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    await userService.deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
