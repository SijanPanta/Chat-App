export default function PostList({
  posts,
  handleDeletePost,
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

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">
            {posts && posts.length > 0
              ? `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""}`
              : "No posts available"}
          </p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post.postId}
              className="group bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start p-6">
                {/* Post Content */}
                <div className="flex-1 pr-4">
                  <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Post Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
