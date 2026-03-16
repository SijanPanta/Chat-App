"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, searchUser } from "@/lib/api";
import SearchUser from "@/app/dashboard/components/SearchUsers";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

  // Fetch the logged-in user from the global cache
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const results = await searchUser(query);
      setSearchResults(results ?? []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
    setSearching(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-4 z-40">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1
          className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          ChatPat
        </h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
            />
            {/* Dropdown Overlay */}
            <SearchUser
              users={searchResults}
              onClose={() => setSearchResults(null)}
              API_URL={API_URL}
              onUserClick={(targetUser) => {
                router.push(
                  `/chat?with=${targetUser.userId}&username=${targetUser.username}`
                );
                // Clear search after clicking
                setSearchResults(null);
                setQuery("");
              }}
            />
          </div>

          {/* Profile Avatar Button */}
          <button
            onClick={() => router.push("/profile")}
            className="relative p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            title="Go to Profile"
          >
            {user?.profilePicture ? (
              <img
                src={`${API_URL}${user?.profilePicture}`}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
