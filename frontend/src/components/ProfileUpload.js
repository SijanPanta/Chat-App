"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePicture } from "@/lib/api";

export default function ProfileUpload({ userId }) {
  const queryClient = useQueryClient();

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
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    uploadMutation.mutate({ userId, formData });
  };

  return (
    <div>
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
  );
}
