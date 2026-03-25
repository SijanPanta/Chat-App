import { verifyToken } from "../lib/grpcClient.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const response = await verifyToken(token);
    if (!response.valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = response.user;
    
    next();
  } catch (error) {
    console.error("Auth service gRPC error:", error.message);
    return res.status(503).json({ error: "Auth service unavailable" });
  }
};
