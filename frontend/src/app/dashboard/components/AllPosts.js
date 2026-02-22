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
  return (
    <PostList
      user={user}
      deleteComment={deleteComment}
      handleDeletePost={handleDeletePost}
      usePostComment={usePostComment}
      useComments={useComments}
      handleLikePost={handleLikePost}
      posts={posts}
      title="All Posts"
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}
