import Select from "react-select";

const options = [
  { value: 1, label: "Tech" },
  { value: 2, label: "Economy" },
  { value: 3, label: "Social" },
];

export default function PostInput({
  postInput,
  postData,
  setPostData,
  setSelectedCategories,
  selectedCategories,
  uploading,
  handleSubmitPost,
  handleCreatePost,
  textareaRef,
  postImage,
  setPostImage,
  fileInputRef
}) {
  if (!postInput) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
    }
  };

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
        <Select
          options={options}
          isMulti
          value={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Select categories"
        />

        <button
          onClick={handleSubmitPost}
          disabled={uploading || !postData.trim()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? "Posting..." : "Post"}
        </button>
        <button
          onClick={()=>handleCreatePost('admin')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Cancel
        </button>
         <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          {postImage ? `📷 ${postImage.name}` : "Add Photo"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
