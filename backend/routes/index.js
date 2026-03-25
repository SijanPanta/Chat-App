import express from "express";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

// Forward all auth requests to auth-service
router.use("/auth", async (req, res) => {
  try {
    const url = `${process.env.AUTH_SERVICE_URL}/auth${req.path}`;
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch(err) {
    res.status(503).json({ error: err.message });
  }
});

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
