export default function ProfilePicture({
  user,
  uploading,
  uploadedUrl,
  fileInputRef,
  fileUpload,
  deleteProfilePicture,
  API_URL,
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      {!user?.profilePicture && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Add Profile Picture
        </button>
      )}
      {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}

      {(uploadedUrl || user?.profilePicture) && (
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
            className="bg-red-500 w-[100%] text-white px-4 py-2 rounded hover:bg-red-600"
          >
            delete
          </button>
        </div>
      )}

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
