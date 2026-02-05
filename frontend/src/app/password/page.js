"use client";
import { useState } from "react";
import { changePassword } from "@/lib/api";

import { useRouter } from "next/navigation";
export default function PasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await changePassword({
        oldPassword,
        newPassword,
      });
      console.log("Password changed successfully");

      // Clear tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setPasswordChanged(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Change Password
          </h1>

          {passwordChanged ? (
            <div className="bg-green-100 text-green-700 p-4 rounded text-center">
              <p className="font-semibold mb-2">
                Password Changed Successfully!
              </p>
              <p className="text-sm">Your password has been updated.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter old password"
                    required
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Change Password
                </button>
                <div className=" flex">

                <button
                  onClick={() => router.push("/login")}
                  className="mt-4 flex-1 bg-orange-500 mr-2 text-white px-6 py-2 rounded hover:bg-orange-600"
                  >
                  Back to login
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-4 flex-1 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                  >
                  Back to Dashboard
                </button>
                  </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
