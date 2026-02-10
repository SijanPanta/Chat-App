export default function PostList({ posts, handleDeletePost, title }) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.postId}
              className="flex justify-between items-center bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-4">
                <p className="text-gray-800">{post.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                  posted by {post.userName}
                </p>
              </div>
              {handleDeletePost && (
                <button
                  onClick={() => handleDeletePost(post.postId)}
                  className="bg-red-500 mr-2 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">
            No posts yet. Create your first post!
          </p>
        )}
      </div>
    </div>
  );
}
