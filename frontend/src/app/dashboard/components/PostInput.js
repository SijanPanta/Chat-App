export default function PostInput({
  postInput,
  postData,
  setPostData,
  uploading,
  handleSubmitPost,
  handleCreatePost,
  textareaRef,
}) {
  if (!postInput) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <textarea
        ref={textareaRef}
        value={postData}
        onChange={(e) => setPostData(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="3"
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmitPost}
          disabled={uploading || !postData.trim()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? "Posting..." : "Post"}
        </button>
        <button
          onClick={handleCreatePost}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
