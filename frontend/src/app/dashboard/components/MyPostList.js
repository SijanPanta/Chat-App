import PostList from "./PostList";

export default function MyPostList({
  posts,
  handleDeletePost,
  handleLikePost,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <PostList
      handleLikePost={handleLikePost}
      posts={posts}
      title="My Posts"
      handleDeletePost={handleDeletePost}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}
