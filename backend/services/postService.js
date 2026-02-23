import { includes } from "zod";
import db from "../models/index.js";

const { User, Post, Category, Like, Comments } = db;

export const createPost = async (userId, userName, content, url) => {
  return await Post.create({
    userId,
    userName,
    content,
    images: url,
  });
};

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

export const createComment = async (postId, userId, content, parentId) => {
  const comment = await Comments.create({
    postId,
    userId,
    content,
    parentId: parentId ?? null,
  });

  return comment;
};

export const getComments = async (postId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;
  const result = await Comments.findAndCountAll({
    where: { postId, parentId: null },
    include: [
      {
        model: User,
        attributes: ["userId", "username"],
        as: "user",
      },
      {
        model: Comments,
        as: "reply",
        include: [
          {
            model: User,
            attributes: ["userId", "username"],
            as: "user",
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset: Number(offset),
  });
  return {
    comments: result.rows,
    totalPages: Math.ceil(result.count / limit),
    currentPage: Number(page),
  };
};

export const getCommentbyId = async (id) => {
  return await Comments.findOne({
    where: { id },
  });
};

export const deleteComment = async (id, userId, postId) => {
  const comment = await Comments.findOne({
    where: { id },
    include: [
      {
        model: Post,
        attributes: ["postId", "userId"],
      },
    ],
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  const isCommentAuthor = comment.userId === userId;
  const isPostOwner = comment.Post && comment.Post.userId === userId;
  if (!isCommentAuthor && !isPostOwner) {
    throw new Error(
      "Unauthorized: You can only delete your own comments or comments on your posts",
    );
  }
  return await comment.destroy();
};

// export const getReply = async (commentId, page = 1, limit = 5) => {
//   const offset = (page - 1) * limit;
//   const result = await Comments.findAndCountAll({
//     where: { parentId: commentId },
//     limit: Number(limit),
//     offset: Number(offset),
//     include: [{ model: User, attributes: ["userId", "username"], as: "user" }],
//     order: [["createdAt", "ASC"]],
//   });
// };
