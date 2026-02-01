import express from "express";
import * as authController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import registerSchema from "../schemas/register.schema.js";
const router = express.Router();

router.post("/register",validate(registerSchema), authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
