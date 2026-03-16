import { useState, useEffect } from "react";
import Select from "react-select";
import Post from "./Post";

export default function PostList({
  user,
  posts,
  handleDeletePost,
  handleLikePost,
  title ,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments,
  usePostComment,
  deleteComment,
}) {
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPost] = useState(posts);

  useEffect(() => {
    setFilteredPost(posts);
  }, [posts]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilter = () => {
    if (categories.length === 0) {
      setFilteredPost(posts);
    } else {
      const filteredPost = posts.filter(
        (post) =>
          post.Categories &&
          post.Categories.some((category) =>
            categories.some((selected) => selected.value === category.id),
          ),
      );
      setFilteredPost(filteredPost);
    }
  };

  const options = [
    { value: 1, label: "Tech" },
    { value: 2, label: "Economy" },
    { value: 3, label: "Social" },
  ];

  // Custom styles to make react-select match Tailwind UI
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      },
      padding: "0.15rem",
      minHeight: "42px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      border: "1px solid #f3f4f6",
      overflow: "hidden",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#bfdbfe",
      },
      padding: "0.5rem 1rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "0.375rem",
      margin: "2px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1d4ed8",
      fontWeight: 500,
      fontSize: "0.875rem",
      padding: "2px 6px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1d4ed8",
      ":hover": {
        backgroundColor: "#dbeafe",
        color: "#1e3a8a",
      },
    }),
  };

  return (
    <div className="mt-2 w-full max-w-4xl mx-auto">
      {/* Filter & Header Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-1">
            {title()}
          </h1>
          <div className="flex items-center text-sm font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            {filteredPosts && filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} post${
                  filteredPosts.length !== 1 ? "s" : ""
                }`
              : "No posts available"}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto z-20 relative">
          <div className="flex-1 sm:w-64">
            <Select
              options={options}
              isMulti
              value={categories}
              onChange={setCategories}
              placeholder="Select categories..."
              styles={customSelectStyles}
              className="text-sm"
            />
          </div>
          <button
            onClick={handleFilter}
            className="flex-shrink-0 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200 font-semibold border border-blue-100 shadow-sm whitespace-nowrap"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.postId}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <Post
                user={user}
                deleteComment={deleteComment}
                usePostComment={usePostComment}
                post={post}
                handleDeletePost={handleDeletePost}
                handleLikePost={handleLikePost}
                useComments={useComments}
              />
            </div>
          ))
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100 shadow-inner">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              There are no posts here right now. Try adjusting your category
              filters or check back later!
            </p>
          </div>
        )}
      </div>

      {/* Modern Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6 pb-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 border border-gray-300 shadow-sm active:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>

          <div className="hidden sm:flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-inner">
              Page{" "}
              <span className="text-gray-900 font-bold mx-1">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 font-bold ml-1">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 border border-gray-300 shadow-sm active:bg-gray-100"
            }`}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
