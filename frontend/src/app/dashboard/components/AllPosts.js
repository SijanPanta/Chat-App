import PostList from "./PostList";

export default function AllPostsList({ posts,handleDeletePost, currentPage, totalPages, setCurrentPage }) {
  // console.log("allposts++++++++++++++++++++++++=",posts)
  return (
    <PostList
      posts={posts}
      title="All Posts"
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );
}