import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User is already registered" });
    }

    const newUser = await authService.createUser(username, email, password);

    const token = authService.generateToken(newUser.id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        userId: newUser.userId,
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
    const { email, password } = req.body;

    // Find user
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValid = await authService.comparePassword(
      password,
      user.password_hash,
    );
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = authService.generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    const user = await authService.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
