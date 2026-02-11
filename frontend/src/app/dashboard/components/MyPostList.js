import PostList from "./PostList";

export default function MyPostList({ posts,handleDeletePost, currentPage, totalPages, setCurrentPage }) {
  return (
    <PostList
      posts={posts}
      title="My Posts"
      handleDeletePost={handleDeletePost}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}