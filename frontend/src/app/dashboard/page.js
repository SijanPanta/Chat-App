"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  deleteProfile,
  fetchUser,
  logout,
  uploadProfilePicture,
  getUserPosts,
  createPost,
} from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [posts, setPosts] = useState({});
  const [postData, setPostData] = useState("");
  const [postInput, setPostInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });
  // console.log(user);
  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [error, router]);

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
    if (!file || !user?.id) return;
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await uploadProfilePicture(user.id, formData);
      setUploadedUrl(res.url || "");
      // Refresh user info
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = () => {
    setPostInput(!postInput);
    setPostData("");
    setUploadError("");
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

      // Refresh posts
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
      await deleteProfile(user.id);
      setUploadedUrl("");
      // Refresh user info to update UI
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (err) {
      setUploadError(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

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
        <div className=" flex justify-between ">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>User ID:</strong> {user?.userId}
              </p>
            </div>
            <button
              onClick={changePassword}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Change Password
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            {!user?.profilePicture && (
              <>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  Add Profile Picture
                </button>
              </>
            )}
            {uploading && (
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-600 mt-2">{uploadError}</p>
            )}
            {uploadedUrl || user?.profilePicture ? (
              <div className="flex flex-col gap-2">
                <img
                  src={uploadedUrl || `${API_URL}${user?.profilePicture}`}
                  alt="Profile"
                  className="mt-4 mx-auto h-24 w-24 rounded-full object-cover"
                />

                <button
                  className="bg-blue-500 w-[100%] text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload new
                </button>
                <button
                  onClick={deleteProfilePicture}
                  className="bg-red-500 w-[100%] text-white px-4 py-2 rounded hover:bg-red-600 "
                >
                  delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={fileUpload}
        />

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleCreatePost}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
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

          {postInput && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <textarea
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSubmitPost}
                  disabled={uploading || !postData.trim()}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? "Posting..." : "Post"}
                </button>
                <button
                  onClick={handleCreatePost}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.postId}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-gray-800">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">
                No posts yet. Create your first post!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
