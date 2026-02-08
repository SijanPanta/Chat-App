import express from "express"
const router =express.Router();
import { authenticate } from "../middlewares/authenticate.js";

import * as postController from "../controllers/postController.js"

router.post('/',authenticate,postController.createPost);
router.get('/',authenticate,postController.getAllPosts);
router.get('/users/:id',authenticate,postController.getUserPosts);

export default router;