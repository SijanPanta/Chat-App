import db from "../models/index.js";

const { Post } = db;

export const createPost = async (userId, content) => {
  return await Post.create({
    userId, // Assuming req.user contains the authenticated user's info
    content,
  });
};

export const getAllPosts = async () => {
  return await Post.findAll();
};

export const getUserPosts = async (userId) => {
  return await Post.findAll({
    where: {
      userId,
    },
  });
};

export const getPostById = async (postId) => {
  const post = await Post.findOne({ where: { postId } });
  return post;
};

export const deletePostById = async (postId) => {
  const post = await Post.findOne({ where: { postId } });
  if (!post) {
    throw new Error("Post not found");
  }
  return await post.destroy();
};
