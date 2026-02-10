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
  getAllPosts,
} from "@/lib/api";

export function useDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

  // State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [postData, setPostData] = useState("");
  const [postInput, setPostInput] = useState(false);
  const [myPost, setMyPost] = useState(true);

  // Pagination state for My Posts
  const [myPostsPage, setMyPostsPage] = useState(1);
  const [myPostsTotalPages, setMyPostsTotalPages] = useState(1);

  // Pagination state for All Posts
  const [allPostsPage, setAllPostsPage] = useState(1);
  const [allPostsTotalPages, setAllPostsTotalPages] = useState(1);

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

  const { data: myPosts = [] } = useQuery({
    queryKey: ["myPosts", user?.userId, myPostsPage], // Include page in query key
    queryFn: async () => {
      const postsPerPage = 5;
      const response = await getUserPosts(
        user?.userId,
        myPostsPage,
        postsPerPage,
      );
      const totalPosts = response.posts.count;
      setMyPostsTotalPages(Math.ceil(totalPosts / postsPerPage)); // Set total pages for My Posts
      return response.posts.rows;
    },
    enabled: !!user?.userId,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ["allPosts", allPostsPage], // Include page in query key
    queryFn: async () => {
      const postsPerPage = 5;
      const response = await getAllPosts(allPostsPage, postsPerPage);
      const totalPosts = response.posts.count;
      setAllPostsTotalPages(Math.ceil(totalPosts / postsPerPage)); // Set total pages for All Posts
      return response.posts.rows;
    },
    keepPreviousData: true, // Keep previous data while fetching new data
  });

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      : (setUploadError(""), setPostInput(true));
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
      const postPayload = {
        content: postData,
        userName: user.username,
      };
      setUploading(true);
      setUploadError("");
      await createPost(postPayload);
      setPostData("");
      setPostInput(false);

      // Refetch both myPosts and allPosts after creating new post
      await queryClient.invalidateQueries({
        queryKey: ["myPosts", user.userId],
      });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
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

      // Refetch both myPosts and allPosts after deleting
      await queryClient.invalidateQueries({
        queryKey: ["myPosts", user.userId],
      });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    } catch (error) {
      console.error("Error deleting post:", error.message);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return {
    // State
    user,
    allPosts,
    myPosts,
    isLoading,
    error,
    uploading,
    uploadError,
    uploadedUrl,
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
    // handlePageChange,
    // setCurrentPage,
    router,
    myPost,
    setMyPost,
    myPostsPage,
    myPostsTotalPages,
    allPostsPage,
    allPostsTotalPages,
    setMyPostsPage,
    setAllPostsPage,
  };
}
