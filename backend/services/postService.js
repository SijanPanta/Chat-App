import db from "../models/index.js";

const { Post } = db;

export const createPost = async (userId, userName, content) => {
  return await Post.create({
    userId,
    userName, // Assuming req.user contains the authenticated user's info
    content,
  });
};

export const getAllPosts = async (offset, limit) => {
  return await Post.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
};

export const getUserPosts = async (userId,offset,limit) => {
  return await Post.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
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
