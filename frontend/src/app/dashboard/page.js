"use client";

import { useDashboard } from "./hooks/useDashboard";
import AllPosts from "./components/AllPosts";
import Navbar from "@/components/Navbar";
import PostInput from "./components/PostInput";
export default function Dashboard() {
  const {
    user,
    allPosts,
    isLoading,
    error,
    uploadError,
    allPostsPage,
    allPostsTotalPages,
    handleDeletePost,
    setAllPostsPage,
    handleLikePost,
    useComments,
    usePostComment,
    deleteComment,
    postInput,
    postData,
    setPostData,
    uploading,
    setSelectedCategories,
    selectedCategories,
    handleSubmitPost,
    handleCreatePost,
    textareaRef,
    postImage,
    setPostImage,
    fileInputRef,
  } = useDashboard();

  if (error) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading ChatPat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      {/* Navbar / Header Area */}
      <Navbar />

      {/* Main Feed Content */}
      <div className="max-w-4xl mx-auto">
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center">
            <span className="font-semibold mr-2">Error:</span> {uploadError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <PostInput
          className="mb-5"
              postInput={postInput}
              postData={postData}
              setPostData={setPostData}
              uploading={uploading}
              setSelectedCategories={setSelectedCategories}
              selectedCategories={selectedCategories}
              handleSubmitPost={handleSubmitPost}
              handleCreatePost={handleCreatePost}
              textareaRef={textareaRef}
              postImage={postImage}
              setPostImage={setPostImage}
              fileInputRef={fileInputRef}
            />
         
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100  animate-in fade-in slide-in-from-top-4 duration-300">
            
          </div>
          <AllPosts
            user={user}
            posts={allPosts}
            handleDeletePost={handleDeletePost}
            usePostComment={usePostComment}
            useComments={useComments}
            currentPage={allPostsPage}
            totalPages={allPostsTotalPages}
            setCurrentPage={setAllPostsPage}
            handleLikePost={handleLikePost}
            deleteComment={deleteComment}
          />
        </div>
      </div>
    </div>
  );
}
