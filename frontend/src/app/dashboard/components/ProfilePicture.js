import {
  PhotoIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePicture({
  user,
  uploading,
  uploadedUrl,
  fileInputRef,
  fileUpload,
  deleteProfilePicture,
  API_URL,
}) {
  const currentImage =
    uploadedUrl ||
    (user?.profilePicture ? `${API_URL}${user.profilePicture}` : null);

  return (
    <div className="flex flex-col items-center shrink-0 w-40">
      {/* Avatar Container */}
      <div
        className="relative mb-4 group cursor-pointer shrink-0"
      >
        <div
          className={`w-32 h-32 rounded-full overflow-hidden shadow-sm border-4 border-white bg-blue-50 flex items-center justify-center transition-all duration-300 ring-1 ring-gray-200 ${
            uploading
              ? "opacity-50"
              : "group-hover:shadow-md group-hover:ring-blue-300"
          }`}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-blue-500 tracking-tight">
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </div>

        {/* Uploading Spinner Overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Quick Edit Overlay */}
        {!uploading && (
          <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
            <PhotoIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 w-full">
        {!currentImage ? (
          <button
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <PhotoIcon className="w-4 h-4" />
            Upload Photo
          </button>
        ) : (
          <>
            <button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Change
            </button>
            <button
              disabled={uploading}
              onClick={deleteProfilePicture}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
              Remove
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={fileUpload}
      />
    </div>
  );
}
