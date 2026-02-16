import express from "express";
const router = express.Router();
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { upload } from "../config/multer.js";

import * as postController from "../controllers/postController.js";

router.post(
  "/",
  authenticate,
  upload.single("postImage"),
  postController.createPost,
);
router.get("/", postController.getAllPosts);
router.get("/users/:id", postController.getUserPosts);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  postController.deletePost,
);

export default router;
