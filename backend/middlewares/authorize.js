import * as userService from "../services/userService.js";

/**
 * Middleware to check if user has required role(s)
 * @param {string|array} roles - Single role or array of roles (e.g., 'ADMIN' or ['ADMIN', 'USER'])
 */
export const authorize = (roles) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authenticate middleware)
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Convert single role to array for consistent handling
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Get user from database to check role
      const user = await userService.getUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user's role is in the allowed roles (case-insensitive)
      const normalizedRoles = allowedRoles.map((role) => role.toLowerCase());
      if (!normalizedRoles.includes(user.role.toLowerCase())) {
        return res.status(403).json({
          error: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ error: "Authorization failed" });
    }
  };
};
