"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { searchUser } from "@/lib/api";
import SearchUser from "@/app/dashboard/components/SearchUsers";
import { useDashboard } from "@/app/dashboard/hooks/useDashboard";

export default function Navbar() {
  const router = useRouter();
  const { handleLogout, user, API_URL } = useDashboard();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const results = await searchUser(query);

      // Filter out the current logged-in user from the search results
      const filteredResults = (results ?? []).filter(
        (searchedUser) => searchedUser.userId !== user?.userId,
      );

      setSearchResults(filteredResults);
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
    <div className="max-w-4xl mx-auto bg-white/80 rounded-xl shadow-sm border border-gray-100 p-4  mb-6 sticky top-4 z-40">
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
                  `/chat?with=${targetUser.userId}&username=${targetUser.username}`,
                );
                // Clear search after clicking
                setSearchResults(null);
                setQuery("");
              }}
            />
          </div>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              title="Open Profile Menu"
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  Your Profile
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
