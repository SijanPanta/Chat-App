import * as postService from "../services/postService.js";
import db from "../models/index.js";

const { Category } = db;
export const createPost = async (req, res) => {
  let fullUrl=null;
  try {
    if (req.file) {
      const postImagePath = `/uploads/posts/${req.file.filename}`;
       fullUrl = `${req.protocol}://${req.get("host")}${postImagePath}`;
    }
    
    // Extract content and categories from req.body
    const { content } = req.body;
    let categories = req.body.categories;
    
    // Parse categories if it's a JSON string
    if (typeof categories === 'string') {
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
    const allPosts = await postService.getAllPosts(offset, limit);
    res.status(201).json({
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
    const posts = await postService.getUserPosts(id, offset, limit);
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
