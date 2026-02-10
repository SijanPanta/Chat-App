import PostList from "./PostList";

export default function MyPostList({ posts,handleDeletePost, currentPage, totalPages, setCurrentPage }) {
  // console.log("myposts++++++++++++++++++++++++=",posts)
  console.log(currentPage,totalPages)
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