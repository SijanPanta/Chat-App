import PostList from "./PostList";

export default function AllPostsList({ posts, handleDeletePost }) {
  return (
    <PostList
      posts={posts}
      handleDeletePost={handleDeletePost}
      title="All Posts"
    />
  );
}
