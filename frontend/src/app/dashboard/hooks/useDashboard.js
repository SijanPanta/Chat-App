import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUIState } from "./useUIState";
import { usePagination } from "./usePagination";
import { useRefs } from "./useRefs";
import { usePostData } from "./usePostData";
import { useHandlers } from "./useHandlers";

export function useDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

  // Use modular hooks
  const uiState = useUIState();
  const pagination = usePagination();
  const refs = useRefs();
  const postData = usePostData(pagination);

  // Get handlers with all dependencies
  const handlers = useHandlers(queryClient, postData.user, uiState, router);

  // Focus textarea when post input is shown
  const handleCreatePost = (role) => {
    uiState.setPostData("");
    if (role !== "admin") {
      alert("You are not Authorized");
      uiState.setUploadError("unauthorized");
      uiState.setPostInput(false);
    } else {
      uiState.setUploadError("");
      uiState.setPostInput(!uiState.postInput);
      // Focus textarea after state update
      setTimeout(() => {
        refs.textareaRef.current?.focus();
      }, 0);
    }
  };

  return {
    // Data from usePostData
    user: postData.user,
    allPosts: postData.allPosts,
    myPosts: postData.myPosts,
    isLoading: postData.isLoading,
    error: postData.error,

    // UI State
    uploading: uiState.uploading,
    uploadError: uiState.uploadError,
    uploadedUrl: uiState.uploadedUrl,
    postData: uiState.postData,
    postInput: uiState.postInput,
    myPost: uiState.myPost,
    selectedCategories: uiState.selectedCategories,
    postImage: uiState.postImage,

    // Constants
    API_URL,

    // Refs
    fileInputRef: refs.fileInputRef,
    textareaRef: refs.textareaRef,

    // Handlers
    handleLogout: handlers.handleLogout,
    changePassword: handlers.changePassword,
    fileUpload: handlers.fileUpload,
    handleCreatePost,
    handleSubmitPost: handlers.handleSubmitPost,
    setPostData: uiState.setPostData,
    deleteProfilePicture: handlers.deleteProfilePicture,
    handleDeletePost: handlers.handleDeletePost,
    setSelectedCategories: uiState.setSelectedCategories,
    setPostImage: uiState.setPostImage,
    handleLikePost: handlers.handleLikePost,
    // Router
    router,

    // Pagination
    myPostsPage: pagination.myPostsPage,
    myPostsTotalPages: pagination.myPostsTotalPages,
    allPostsPage: pagination.allPostsPage,
    allPostsTotalPages: pagination.allPostsTotalPages,
    setMyPostsPage: pagination.setMyPostsPage,
    setAllPostsPage: pagination.setAllPostsPage,

    // MyPost toggle
    setMyPost: uiState.setMyPost,
  };
}
