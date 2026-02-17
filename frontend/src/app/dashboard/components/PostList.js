import { toggleLike } from "@/lib/api";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function PostList({
  posts,
  handleDeletePost,
  handleLikePost,
  title,
  currentPage,
  totalPages,
  setCurrentPage,
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
            <div
              key={post.postId}
              className="group bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start p-6">
                {/* Post Content */}
                <div className="flex-1 pr-4 bg-blue-50">
                  <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.images && (
                    <div className="mt-4">
                      <img
                      onDoubleClick={()=>handleLikePost(post.postId)}
                        src={post.images}
                        alt={`Post ${post.postId}`}
                        className="w-64 h-64 rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Post Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-500">👤</span>
                      <span className="font-medium text-gray-700">
                        {post.userName}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-green-500">📅</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-purple-500">🕐</span>
                      <span>
                        {new Date(post.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Like Button and Counter */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleLikePost(post.postId)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        post.isLiked
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <span className="text-lg">
                        {post.isLiked ? "❤️" : "🤍"}
                      </span>
                      <span>{post.isLiked ? "Liked" : "Like"}</span>
                    </button>
                    <span className="text-gray-700 font-semibold">
                      {post.likesCount || 0}{" "}
                      {post.likesCount === 1 ? "Like" : "Likes"}
                    </span>
                  </div>

                  {/* Post Categories */}
                  {post.Categories && post.Categories.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Categories:{" "}
                      {post.Categories.map((category) => category.name).join(
                        ", ",
                      )}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                {handleDeletePost && (
                  <button
                    onClick={() => handleDeletePost(post.postId)}
                    className="flex-shrink-0 bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    title="Delete this post"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
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
