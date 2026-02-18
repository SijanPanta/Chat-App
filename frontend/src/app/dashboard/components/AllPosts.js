import PostList from "./PostList";

export default function AllPostsList({
  posts,
  handleLikePost,
  currentPage,
  totalPages,
  setCurrentPage,
  useComments,
}) {
  return (
    <PostList
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
