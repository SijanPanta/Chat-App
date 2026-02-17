import { where } from "sequelize";
import db from "../models/index.js";

const { User,Post, Category, Like, Comments } = db;

export const createPost = async (userId, userName, content, url) => {
  return await Post.create({
    userId,
    userName,
    content,
    images: url,
  });
};
// Add currentUserId as a parameter
export const getAllPosts = async (offset, limit, currentUserId) => {
  const result = await Post.findAndCountAll({
    offset: Number(offset),
    limit: Number(limit),
    distinct: true,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Category,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
      {
        model: Like,
        as: "likes",
        attributes: ["userId"],
        required: false,
      },
    ],
  });
  // Add likesCount and isLiked to each post
  const postsWithLikes = result.rows.map((post) => {
    const postJson = post.toJSON();
    const likes = postJson.likes || [];

    return {
      ...postJson,
      likesCount: likes.length,
      isLiked: likes.some((like) => like.userId === currentUserId),
      likes: undefined, // Remove the likes array from response
    };
  });

  return {
    count: result.count,
    rows: postsWithLikes,
  };
};

export const getUserPosts = async (userId, offset, limit, currentUserId) => {
  const result = await Post.findAndCountAll({
    offset: Number(offset),
    limit: Number(limit),
    distinct: true,
    order: [["createdAt", "DESC"]],
    where: { userId },
    include: [
      {
        model: Category,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
      {
        model: Like,
        as: "likes",
        attributes: ["userId"],
        required: false,
      },
    ],
  });
  // Add likesCount and isLiked to each post
  const postsWithLikes = result.rows.map((post) => {
    const postJson = post.toJSON();
    const likes = postJson.likes || [];

    return {
      ...postJson,
      likesCount: likes.length,
      // Check if CURRENT logged-in user liked this post
      isLiked: likes.some(
        (like) => String(like.userId) === String(currentUserId),
      ),
      likes: undefined, // Remove the likes array from response
    };
  });

  return {
    count: result.count,
    rows: postsWithLikes,
  };
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

export const updatePostById = async (postId, updateData) => {
  const post = await Post.findOne({ where: { postId } });
  if (!post) {
    throw new Error("Post not found");
  }
  return await post.update(updateData);
};

export const createComment = async (postId, userId, content) => {
  const comment = await Comments.create({
    postId,
    userId,
    content,
  });
  return comment;
};

export const getComments = async (postId) => {
  return await Comments.findAll({
    where: { postId },
    include: [
      {
        model:User,
        attributes: ["userId", "username"],
        as:'user'
      },
    ],
     order: [["createdAt", "DESC"]],
  });
};

export const getCommentbyId=async(id)=>{
  return await Comments.findOne({
    where:{id}
  })
}

export const deleteComment=async(id,userId)=>{
 const comment=await Comments.findOne({
    where:{userId,id}
  })
  if(!comment){
    throw new Error("Unauthorized"); 
  }
  return await comment.destroy();
}