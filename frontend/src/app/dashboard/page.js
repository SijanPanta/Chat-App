"use client";

import { useDashboard } from "./hooks/useDashboard";
import UserInfo from "./components/UserInfo";
import ProfilePicture from "./components/ProfilePicture";
import PostInput from "./components/PostInput";
import MyPostsList from "./components/MyPostList";
import AllPosts from "./components/AllPosts";

export default function Dashboard() {
  const {
    user,
    allPosts,
    isLoading,
    error,
    uploading,
    uploadError,
    uploadedUrl,
    myPosts,
    postData,
    postInput,
    API_URL,
    fileInputRef,
    textareaRef,
    allPostsPage,
    allPostsTotalPages,
    myPostsTotalPages,
    myPostsPage,
    selectedCategories,
    postImage,
    handleLogout,
    changePassword,
    fileUpload,
    handleCreatePost,
    handleSubmitPost,
    setPostData,
    deleteProfilePicture,
    handleDeletePost,
    setMyPostsPage,
    setAllPostsPage,
    setSelectedCategories,
    setPostImage,
    router,
    myPost,
    setMyPost,
    handleLikePost,
    useComments,
    usePostComment,
    deleteComment
  } = useDashboard();
  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Chat App! 🎉</h1>
        {uploadError && (
          <p className="text-sm text-red-600 mt-2">{uploadError}</p>
        )}

        <div className="flex justify-between">
          <UserInfo user={user} changePassword={changePassword} />
          <ProfilePicture
            user={user}
            uploading={uploading}
            uploadedUrl={uploadedUrl}
            fileInputRef={fileInputRef}
            fileUpload={fileUpload}
            deleteProfilePicture={deleteProfilePicture}
            API_URL={API_URL}
          />
        </div>

        <div className="mb-6">
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
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setMyPost(true)}
            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
              myPost
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setMyPost(false)}
            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
              !myPost
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Posts
          </button>
        </div>
        {myPost ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
