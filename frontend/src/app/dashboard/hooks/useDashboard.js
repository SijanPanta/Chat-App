import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  deleteProfile,
  fetchUser,
  logout,
  uploadProfilePicture,
  getUserPosts,
  createPost,
  deletePost,
} from "@/lib/api";

export function useDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

  // State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [posts, setPosts] = useState({});
  const [postData, setPostData] = useState("");
  const [postInput, setPostInput] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [error, router]);

  // Fetch posts when user is available
  useEffect(() => {
    if (!user?.userId) return;

    const fetchPosts = async () => {
      try {
        const myPost = await getUserPosts(user.userId);
        setPosts(Array.isArray(myPost?.posts) ? myPost.posts : []);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        setUploadError("Failed to fetch posts. Please try again later.");
        setPosts([]);
      }
    };

    fetchPosts();
  }, [user?.userId]);

  // Handlers
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
      router.push("/login");
    }
  };

  const changePassword = () => {
    router.push("/password");
  };

  const fileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.userId) return;
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await uploadProfilePicture(user.userId, formData);
      setUploadedUrl(res.url || "");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = (role) => {
    setPostData("");
    role !== "admin"
      ? (setUploadError("unauthorized"), setPostInput(false))
      : (setUploadError(""),setPostInput(true));
    if (!postInput) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleSubmitPost = async () => {
    if (!postData.trim()) {
      setUploadError("Post content cannot be empty");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      await createPost(postData);
      setPostData("");
      setPostInput(false);

      const myPost = await getUserPosts(user.userId);
      setPosts(Array.isArray(myPost?.posts) ? myPost.posts : []);
    } catch (error) {
      console.error("Error creating post:", error.message);
      setUploadError("Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      setUploading(true);
      setUploadError("");
      await deleteProfile(user.userId);
      setUploadedUrl("");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (err) {
      setUploadError(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setUploading(true);
      setUploadError("");
      await deletePost(id);
      setUploadedUrl("");
      const myPost = await getUserPosts(user.userId);
      setPosts(Array.isArray(myPost?.posts) ? myPost.posts : []);
    } catch (error) {
      console.error("Error deleting post:", error.message);
      setUploadError("Failed to delete post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return {
    // State
    user,
    isLoading,
    error,
    uploading,
    uploadError,
    uploadedUrl,
    posts,
    postData,
    postInput,
    API_URL,
    // Refs
    fileInputRef,
    textareaRef,
    // Handlers
    handleLogout,
    changePassword,
    fileUpload,
    handleCreatePost,
    handleSubmitPost,
    setPostData,
    deleteProfilePicture,
    handleDeletePost,
    router,
  };
}
