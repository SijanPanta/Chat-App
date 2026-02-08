import { where } from "sequelize";
import db from "../models/index.js";

const { Post } = db;

export const createPost = async (userId, content) => {
    
  return await Post.create({
    userId, // Assuming req.user contains the authenticated user's info
    content,
  });
};

export const getAllPosts=async()=>{
    return await Post.findAll();
}

export const getUserPosts =async(userId)=>{
    return await Post.findAll({where:{
        userId
    }})
}