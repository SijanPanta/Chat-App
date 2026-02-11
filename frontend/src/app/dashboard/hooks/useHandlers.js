import {
  logout,
  uploadProfilePicture,
  createPost,
  deletePost,
  deleteProfile
} from "@/lib/api";

export function useHandlers(queryClient, user, uiState, router) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

  // Extract UI state setters
  const { setUploading, setUploadError, setUploadedUrl, postData, setPostData, setPostInput } = uiState;

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
      : (setUploadError(""), setPostInput(true));
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
    API_URL,
    handleLogout,
    changePassword,
    fileUpload,
    handleCreatePost,
    handleSubmitPost,
    deleteProfilePicture,
    handleDeletePost
  };
}