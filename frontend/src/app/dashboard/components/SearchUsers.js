"use client";

import { useEffect, useRef } from "react";

export default function SearchUser({ users, onClose, API_URL, onUserClick }) {
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // console.log(users);
  if (!users) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
    >
      {users.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500 text-center">
          No users found
        </div>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.userId}
              onClick={() => {
                onUserClick(user);
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
            >
              {/* Avatar initial */}
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={`${API_URL}${user?.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  (user.username?.[0]?.toUpperCase() ?? "?")
                )}
              </div>

              {/* Username + email */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {user.username}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
              </div>

              {/* Role badge */}
              {user.role && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize flex-shrink-0">
                  {user.role}
                </span>
              )}
              <button>Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
