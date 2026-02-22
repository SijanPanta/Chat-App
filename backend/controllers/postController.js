import * as postService from "../services/postService.js";
import db from "../models/index.js";

const { Category, Like } = db;
export const createPost = async (req, res) => {
  let fullUrl = null;
  try {
    if (req.file) {
      const postImagePath = `/uploads/posts/${req.file.filename}`;
      fullUrl = `${req.protocol}://${req.get("host")}${postImagePath}`;
    }

    // Extract content and categories from req.body
    const { content } = req.body;
    let categories = req.body.categories;

    // Parse categories if it's a JSON string
    if (typeof categories === "string") {
      try {
        categories = JSON.parse(categories);
      } catch (e) {
        categories = [];
      }
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    // Create the post first
    const newPost = await postService.createPost(
      req.user.userId,
      req.user.username,
      content,
      fullUrl,
    );

    // Handle categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      // Validate and fetch/create categories
      const categoryInstances = await Promise.all(
        categories.map(async (catName) => {
          const [catInstance] = await Category.findOrCreate({
            where: { name: catName },
          });
          return catInstance;
        }),
      );

      // Associate the post with the categories
      await newPost.addCategories(categoryInstances);

      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
        categories: categoryInstances,
      });
    } else {
      // Post created without categories
      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    }
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).json({
      message: "Failed to create post",
      error: err.message,
    });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const allPosts = await postService.getAllPosts(
      offset,
      limit,
      req.user.userId,
    );
    res.status(200).json({
      posts: allPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "couldnot fetch the posts",
      error: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { id } = req.params;
    const currentUserId = req.user?.userId; // Get current logged-in user
    const posts = await postService.getUserPosts(
      id,
      offset,
      limit,
      currentUserId,
    );
    res.status(201).json({
      posts,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.deletePostById(id);
    res.status(200).json({
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    const existingLike = await Like.findOne({
      where: { userId, postId },
    });
    if (existingLike) {
      await existingLike.destroy();
      res.status(200).json({ liked: false, message: "Unliked" });
    } else {
      await Like.create({ userId, postId });
      return res.status(201).json({ liked: true, message: "Liked" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Content cannot be empty" });
    }
    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    const comment = await postService.createComment(postId, userId, content);
    return res.status(201).json({ postId, userId, comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const result = await postService.getComments(postId, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const userId = req.user.userId;
    const deletedComment = await postService.deleteComment(commentId, userId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
