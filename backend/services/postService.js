import { includes } from "zod";
import db from "../models/index.js";

const { Post, Category, Like, sequelize } = db;

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
// export const getAllPosts = async (offset, limit) => {
//   return await Post.findAndCountAll({
//     offset,
//     limit,
//     order: [["createdAt", "DESC"]],
//     include: [
//       {
//         model: Category,
//         through: { attributes: [] },
//         attributes: ["id", "name"],
//       },
//       {
//         model: Like,
//         as: "likes",
//         attributes: ["userId"], // Just enough to count
//       },
//     ],

//     // This adds a count and a boolean to every post object
//     attributes: {
//       include: [
//         [sequelize.fn("COUNT", sequelize.col("likes.id")), "likesCount"],
//         // Check if the current user ID exists in the likes subquery
//         [
//           sequelize.literal(
//             `EXISTS(SELECT 1 FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${currentUserId})`,
//           ),
//           "isLiked",
//         ],
//       ],
//       group: ["Post.id"], //
//     },
//   });
// };

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

export const updatePostById = async (postId, updateData) => {
  const post = await Post.findOne({ where: { postId } });
  if (!post) {
    throw new Error("Post not found");
  }
  return await post.update(updateData);
};
