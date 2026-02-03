"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUser, logout, uploadProfilePicture } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

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
//   console.log(user);
  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [error, router]);

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
              <strong>User ID:</strong> {user?.id}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          {!user?.profilePicture && (
            <>
          <h2 className="text-2xl font-semibold mb-4">
            Upload Profile Picture
          </h2>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
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
            }}
            />
            </>
        )}
          {uploading && (
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
          )}
          {uploadError && (
              <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}
          {/* Preview uploaded image or fallback to user's saved profilePicture */}
          {uploadedUrl || user?.profilePicture ? (
              <img
              src={uploadedUrl || `${API_URL}${user?.profilePicture}`}
              alt="Profile"
              className="mt-4 h-24 w-24 rounded-full object-cover"
              />
            ) : null}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/chat")}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
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
      </div>
    </div>
  );
}
