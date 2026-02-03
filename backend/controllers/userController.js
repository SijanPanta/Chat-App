import * as userService from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfile = async (req, res) => {
  try {
    const { id } = req.params;
    return res.json({ message: "file is uploaded", id });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await userService.updateUserById(id, {
      profilePicture: profilePicturePath,
    });

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    await userService.deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
