import PostList from "./PostList";

export default function AllPostsList({
  user,
  posts,
  handleLikePost,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments,
  usePostComment,
  deleteComment,
  handleDeletePost,
}) {
  const titleForall = () => {
    return (
      <div className="mb-6 border-b border-gray-100 mt-5 pb-4">
        <h2 className="text-xl font-bold text-gray-800">Global Feed</h2>
        <p className="text-sm text-gray-500 mt-1">
          See what's happening across Guff-Gaff.
        </p>
      </div>

    )
  }
  return (
    <PostList
      user={user}
      deleteComment={deleteComment}
      handleDeletePost={handleDeletePost}
      usePostComment={usePostComment}
      useComments={useComments}
      handleLikePost={handleLikePost}
      posts={posts}
      title={titleForall}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}
