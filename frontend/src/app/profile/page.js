// /home/sijan/projects/Chat-App/frontend/src/app/profile/page.js
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import ProfilePicture from "../dashboard/components/ProfilePicture";
import MyPostsList from "../dashboard/components/MyPostList";
import PostInput from "../dashboard/components/PostInput";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    uploading,
    isLoading,
    error,
    uploadedUrl,
    fileInputRef,
    fileUpload,
    deleteProfilePicture,
    API_URL,
    myPosts,
    usePostComment,
    useComments,
    handleDeletePost,
    myPostsPage,
    setMyPostsPage,
    myPostsTotalPages,
    handleLikePost,
    deleteComment,
    handleCreatePost,
    postInput,
    postData,
    setPostData,
    setSelectedCategories,
    selectedCategories,
    handleSubmitPost,
    textareaRef,
    postImage,
    setPostImage,
    handleLogout,
    handleDeleteAccount,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <Navbar />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative">
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center shrink-0">
              <ProfilePicture
                user={user}
                uploading={uploading}
                uploadedUrl={uploadedUrl}
                fileInputRef={fileInputRef}
                fileUpload={fileUpload}
                deleteProfilePicture={deleteProfilePicture}
                API_URL={API_URL}
              />
              <span className="mt-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                {user.role} Account
              </span>
            </div>

            {/* Details & Actions Section */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                    Username
                  </p>
                  <p className="text-lg font-medium text-gray-800 truncate">
                    {user.username}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-medium text-gray-800 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleCreatePost(user.role)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                    postInput
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                  }`}
                  title={
                    user?.role !== "admin" ? "Only admins can create posts" : ""
                  }
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  {postInput ? "Cancel Post" : "Create Post"}
                </button>

                <button
                  onClick={() => router.push("/chat")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Go to Chat
                </button>

                <button
                  onClick={() => router.push("/password")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors"
                >
                  <KeyIcon className="w-5 h-5 text-gray-500" />
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors md:ml-auto"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors md:ml-auto"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Input Section (Conditionally Rendered) */}
        {postInput && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Create a New Post
            </h3>
            <PostInput
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
          </div>
        )}

        {/* User's Posts Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <MyPostsList
            user={user}
            posts={myPosts}
            usePostComment={usePostComment}
            useComments={useComments}
            handleDeletePost={handleDeletePost}
            currentPage={myPostsPage}
            totalPages={myPostsTotalPages}
            setCurrentPage={setMyPostsPage}
            handleLikePost={handleLikePost}
            deleteComment={deleteComment}
          />
        </div>
      </div>
    </div>
  );
}
