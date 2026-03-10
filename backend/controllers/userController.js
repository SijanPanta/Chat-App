import bcrypt from "bcrypt";
import * as userService from "../services/userService.js";

// Calls auth-service to clear the Redis cache for a user
// Must be called after any mutation to the user's data
const clearUserCache = async (userId) => {
  try {
    await fetch(`${process.env.AUTH_SERVICE_URL}/auth/cache/${userId}`, {
      method: "DELETE",
    });
  } catch (err) {
    // Cache clearing failure should never break the main operation
    console.error("Failed to clear user cache:", err.message);
  }
};

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

    await clearUserCache(id);

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

    await userService.updateUserById(id, { profilePicture: null });
    await clearUserCache(id);

    res.status(200).json({ message: "Profile picture deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(
      oldPassword,
      user.password_hash,
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userService.updateUserById(user.userId, {
      password_hash: hashedPassword,
    });

    await clearUserCache(user.userId);

    const { password_hash, ...userWithoutPassword } = user.toJSON();

    return res.status(200).json({
      message: "Password changed successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      error: "Failed to change password. Please try again.",
    });
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
    await clearUserCache(id);

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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await userService.deleteUserById(id);
    await clearUserCache(id);

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
