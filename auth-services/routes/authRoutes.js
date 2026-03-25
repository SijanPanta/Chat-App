import express from "express";
import * as authController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schemas/schema.js";

const router = express.Router();
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

// /me — verify token first, then return current user
router.get(
  "/me",
  authController.verifyMiddleware,
  authController.getCurrentUser,
);

// Internal route — called by the main app's authenticate middleware
router.get("/verify", authController.verify);

// Internal route — called by the main app whenever a user's data is mutated
router.delete("/cache/:userId", authController.invalidateCache);

export default router;
