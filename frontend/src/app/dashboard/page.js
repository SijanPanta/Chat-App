"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchUser, uploadProfilePicture, logout } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [error, router]);

  const uploadMutation = useMutation({
    mutationFn: ({ userId, formData }) =>
      uploadProfilePicture(userId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      alert("Profile picture uploaded successfully!");
    },
    onError: (error) => {
      alert(error.message || "Upload failed");
    },
  });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    uploadMutation.mutate({ userId: user.id, formData });
  };

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

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Upload Profile Picture</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploadMutation.isPending}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadMutation.isPending && (
            <p className="mt-2 text-blue-600">Uploading...</p>
          )}
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
