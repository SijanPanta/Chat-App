import { useState, useEffect } from "react";
import Select from "react-select";
import Post from "./Post";

export default function PostList({
  posts,
  handleDeletePost,
  handleLikePost,
  title,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments,
}) {
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
  // console.log('===================',posts)
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPost] = useState(posts);

  useEffect(() => {
    setFilteredPost(posts);
  }, [posts]);

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex gap-2 items-center mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">
            {filteredPosts && filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}`
              : "No posts available"}
          </p>
        </div>
        <Select
          options={options}
          isMulti
          value={categories}
          onChange={setCategories}
          placeholder="Select categories"
        />
        <button
          onClick={handleFilter}
          className="flex-shrink-0 bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Filter
        </button>
      </div>
      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <Post
              key={post.postId}
              post={post}
              handleDeletePost={handleDeletePost}
              handleLikePost={handleLikePost}
              useComments={useComments}
            />
          ))
        ) : (
          // Empty State
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              No posts yet
            </p>
            <p className="text-gray-500">
              Be the first to create a post and share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            ← Previous
          </button>

          <div className="px-6 py-3 bg-white rounded-lg border-2 border-blue-500 shadow-sm">
            <span className="font-semibold text-gray-700">
              Page <span className="text-blue-600">{currentPage}</span> of{" "}
              <span className="text-blue-600">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
