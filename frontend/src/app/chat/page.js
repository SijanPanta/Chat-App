"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Chat interface coming soon...</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
