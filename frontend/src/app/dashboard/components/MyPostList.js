import PostList from "./PostList";

export default function MyPostsList({ posts, handleDeletePost }) {
  return <PostList posts={posts} handleDeletePost={handleDeletePost} title="Your Posts" />;
}