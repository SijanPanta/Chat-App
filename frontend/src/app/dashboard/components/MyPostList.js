import PostList from "./PostList";

export default function MyPostList({
  posts,
  handleDeletePost,
  handleLikePost,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments
}) {
  return (
    <PostList
      handleLikePost={handleLikePost}
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
