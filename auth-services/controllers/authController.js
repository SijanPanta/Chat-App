import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "User is already registered" });
    }

    const newUser = await authService.createUser(
      username,
      email,
      password,
      role,
    );
    const token = authService.generateToken(newUser.userId);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email credentials" });
    }

    const isValid = await authService.comparePassword(
      password,
      user.password_hash,
    );
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = authService.generateToken(user.userId);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      await authService.invalidateSession(token);
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware — verifies token and attaches user to req, then calls next()
// Used by routes that need auth before doing something else (e.g. /me)
export const verifyMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }

    const user = await authService.verifyAndGetUser(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user; // attach user for next handler
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Route handler — called by the main app's authenticate middleware via GET /verify
// Returns the user payload so the main app can attach it to req.user
export const verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }

    const user = await authService.verifyAndGetUser(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Route handler — returns the currently authenticated user
// Must be used after verifyMiddleware so req.user is already set
export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture || null,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
