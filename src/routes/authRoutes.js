import express from "express";
import * as authController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import * as schema from "../schemas/schema.js";
const router = express.Router();

router.post("/register",validate(schema.registerSchema), authController.register);
router.post("/login",validate(schema.loginSchema) ,authController.login);
router.post("/logout", authController.logout);

export default router;
