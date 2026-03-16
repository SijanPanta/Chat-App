// /home/sijan/projects/Chat-App/frontend/src/app/profile/page.js
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
  } = useDashboard();

  // 2. Handle loading and error states (or redirect if not logged in)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !user) {
    // If no user, redirect to login
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  // 3. Render the profile using the cached `user` data!
  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar/>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 text-gray-500 hover:text-gray-800"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

        <div className="flex flex-col items-center">
          {/* Display Profile Picture */}

          <ProfilePicture
            user={user}
            uploading={uploading}
            uploadedUrl={uploadedUrl}
            fileInputRef={fileInputRef}
            fileUpload={fileUpload}
            deleteProfilePicture={deleteProfilePicture}
            API_URL={API_URL}
          />

          {/* User Details */}
          <div className="w-full space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium">{user.username}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium capitalize">{user.role}</p>
            </div>
            <div className="flex gap-4 mb-4">
              <button
                onClick={(e) => handleCreatePost(user.role)}
                className={`px-6 py-2 rounded ${"bg-green-500 text-white hover:bg-green-600"}`}
                title={
                  user?.role !== "admin" ? "Only admins can create posts" : ""
                }
              >
                {postInput ? "Cancel" : "Create Post"}
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Go to Chat
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
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
