import express from "express";
const router = express.Router();
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { upload, validateImageContent } from "../config/multer.js";

import * as postController from "../controllers/postController.js";

router.post(
  "/",
  authenticate,
  upload.single("postImage"),
  validateImageContent,
  postController.createPost,
);
router.get("/", authenticate, postController.getAllPosts);
router.get("/users/:id", authenticate, postController.getUserPosts);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  postController.deletePost,
);
router.post("/:postId/like", authenticate, postController.toggleLike);
router.post("/comments/:postId", authenticate, postController.createComment);
router.get("/comments/:postId", authenticate, postController.getComments);
router.delete(
  "/comments/:commentId",
  authenticate,
  postController.deleteComment,
);
export default router;
