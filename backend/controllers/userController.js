import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
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

export const passwordReset = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        error: "Old password and new password are required" 
      });
    }
    
    // Check if passwords are the same
    if (oldPassword === newPassword) {
      return res.status(400).json({ 
        error: "New password must be different from old password" 
      });
    }
    
    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters" 
      });
    }
    
    // Get user - Use userService instead of authService
    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify old password
    const isValidPassword = await authService.comparePassword(
      oldPassword,
      user.password_hash
    );
    
    if (!isValidPassword) {
      return res.status(400).json({ 
        error: "Current password is incorrect" 
      });
    }

    // Hash new password
    const hashedPassword = await authService.hashPassword(newPassword);
    
    // Update password
    await userService.updateUserById(user.id, {
      password_hash: hashedPassword,
    });
    
    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user.toJSON();
    
    return res.status(200).json({ 
      message: "Password changed successfully",
      user: userWithoutPassword 
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ 
      error: "Failed to change password. Please try again." 
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
