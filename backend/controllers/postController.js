import { ConnectionAcquireTimeoutError } from "sequelize";
import * as postService from "../services/postService.js";

export const createPost = async (req, res) => {
  try {
    // Extract content from req.body
    const { content } = req.body;
console.log("===================================",content)
const postContent=content.content;
// const userName=content.userName;
    // Validate content
    if (!postContent || postContent.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    // Call the service to create the post
    const newPost = await postService.createPost(
      req.user.userId,
      req.user.username,
      postContent,
    );

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create post",
      error: err.message,
    });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postService.getAllPosts();
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
    const { id } = req.params;
    const posts = await postService.getUserPosts(id);
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
