import Select from "react-select";

const options = [
  { value: 1, label: "Tech" },
  { value: 2, label: "Economy" },
  { value: 3, label: "Social" },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minWidth: "200px",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#22c55e" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(34,197,94,0.2)" : "none",
    "&:hover": { borderColor: "#22c55e" },
    fontSize: "14px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#dcfce7",
    borderRadius: "6px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#15803d",
    fontWeight: 500,
    fontSize: "12px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#16a34a",
    "&:hover": { backgroundColor: "#bbf7d0", color: "#15803d" },
  }),
  placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "14px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: state.isSelected
      ? "#22c55e"
      : state.isFocused
      ? "#f0fdf4"
      : "white",
    color: state.isSelected ? "white" : "#111827",
  }),
};

export default function PostInput({
  postInput,
  postData,
  postImage,
  uploading,
  selectedCategories,
  textareaRef,
  fileInputRef,
  setPostData,
  setPostImage,
  setSelectedCategories,
  handleSubmitPost,
  handleCreatePost,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPostImage(file);
  };

  const isPostDisabled = uploading || (!postData.trim() && !postImage);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm ">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Create Post
        </p>
      </div>

      {/* Textarea */}
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={postData}
          onChange={(e) => setPostData(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
        />
      </div>

      {/* Image preview */}
      {postImage && (
        <div className="mx-4 mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-green-600 text-sm">📷</span>
          <span className="text-green-700 text-xs font-medium truncate flex-1">
            {postImage.name}
          </span>
          <button
            onClick={() => setPostImage(null)}
            className="text-green-400 hover:text-green-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        {/* Category Select */}
        <div className=" min-w-[180px]">
          <Select
            options={options}
            isMulti
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Add categories..."
            styles={selectStyles}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Cancel */}
          <button
            onClick={() => handleCreatePost("admin")}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmitPost}
            disabled={isPostDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {uploading ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Posting...
              </span>
            ) : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}