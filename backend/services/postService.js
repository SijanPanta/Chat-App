import { includes } from "zod";
import db from "../models/index.js";

const { Post, Category } = db;

export const createPost = async (userId, userName, content,images) => {
  return await Post.create({
    userId,
    userName, 
    content,
    images
  });
};

export const getAllPosts = async (offset, limit) => {
  return await Post.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Category,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
  });
};

export const getUserPosts = async (userId, offset, limit) => {
  return await Post.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    where: {
      userId,
    },
    include: {
      model: Category,
      through: { attributes: [] },
      attributes: ["id", "name"],
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

export const updatePostById=async (postId,updateData)=>{
  const post = await Post.findOne({ where: { postId } });
  if (!post) {
    throw new Error("Post not found");
  }
  return await post.update(updateData);
}