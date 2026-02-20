import { useState } from "react";

export default function Post({
  user,
  post,
  handleDeletePost,
  handleLikePost,
  useComments,
  usePostComment,
  deleteComment
}) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const { data: comments, isLoading } = useComments(post.postId);
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-start p-6">
        {/* Post Content */}
        <div className="flex-1 pr-4">
          <p className="text-gray-800 text-lg leading-relaxed mb-4">
            {post.content}
          </p>

          {/* Post Image */}
          {post.images && (
            <div className="mt-4">
              <img
                onDoubleClick={() => handleLikePost(post.postId)}
                src={post.images}
                alt={`Post ${post.postId}`}
                className="w-64 h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          )}

          {/* Post Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">👤</span>
              <span className="font-medium text-gray-700">{post.userName}</span>
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

          {/* Action Buttons - Like and Comments */}
          <div className="flex items-center gap-3 mt-4">
            {/* Like Button */}
            <button
              onClick={() => handleLikePost(post.postId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                post.isLiked
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span className="text-lg">{post.isLiked ? "❤️" : "🤍"}</span>
              <span>{post.isLiked ? "Liked" : "Like"}</span>
            </button>
            <span className="text-gray-700 font-semibold">
              {post.likesCount || 0} {post.likesCount === 1 ? "Like" : "Likes"}
            </span>

            {/* Comments Button */}
            <button
              onClick={toggleComments}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
            >
              <span className="text-lg">💬</span>
              <span>{showComments ? "Hide Comments" : "Show Comments"}</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder={`Add your comment as ${user.username}`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={() => {
                  usePostComment(post.postId, comment);
                  setComment("");
                }}
                className="mt-2 mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-lg">💬</span>
                <span>Post Comment</span>
              </button>

              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Comments
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-600">Loading comments...</p>
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {comment.user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              {comment.user?.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        {(user.username === comment.user?.username||post.userName===user.username) && (
                          <button
                            onClick={()=>deleteComment(comment.id,post.postId)}
                            className="bg-red-800 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors duration-200">
                            🗑️ Delete
                          </button>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Post Categories */}
          {post.Categories && post.Categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.Categories.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                >
                  {category.name}
                </span>
              ))}
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
  );
}
