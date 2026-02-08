import * as postService from "../services/postService.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    const newPost = await postService.createPost(req.user.userId, content);
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
      error: err.message,
    });
  }
};

export const getUserPosts=async (req,res)=>{
    try {
        const {id}=req.params;
        const posts=await postService.getUserPosts(id);
        res.status(201).json({
            posts
        })
    } catch (error) {
        
    }
}
