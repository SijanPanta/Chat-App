import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../config/multer.js";
import validate  from "../middlewares/validate.js";
import { passwordResetSchema } from "../schemas/schema.js";
const router = express.Router();

router.get("/", authenticate, userController.getAllUsers);
router.post(
  "/:id/profile-picture",
  authenticate,
  upload.single("profilePicture"),
  userController.uploadProfilePicture,
);
router.delete(
  "/:id/profile-picture",
  authenticate,
  userController.deleteProfilePicture,
);
router.get("/:id", authenticate, userController.getUserById);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put(
  "/password/reset",
  authenticate,
  validate(passwordResetSchema),
  userController.passwordReset,
);

export default router;
