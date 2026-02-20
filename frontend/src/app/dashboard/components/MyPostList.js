import PostList from "./PostList";

export default function MyPostList({
  user,
  posts,
  handleDeletePost,
  handleLikePost,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments,
  usePostComment,
  deleteComment,
}) {
  return (
    <PostList
      deleteComment={deleteComment}
      user={user}
      handleLikePost={handleLikePost}
      usePostComment={usePostComment}
      useComments={useComments}
      posts={posts}
      title="My Posts"
      handleDeletePost={handleDeletePost}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}
