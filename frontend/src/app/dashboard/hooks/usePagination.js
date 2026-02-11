import { useState } from "react";

export function usePagination() {
  // Pagination state for My Posts
  const [myPostsPage, setMyPostsPage] = useState(1);
  const [myPostsTotalPages, setMyPostsTotalPages] = useState(1);

  // Pagination state for All Posts
  const [allPostsPage, setAllPostsPage] = useState(1);
  const [allPostsTotalPages, setAllPostsTotalPages] = useState(1);

  return {
    myPostsPage,
    myPostsTotalPages,
    allPostsPage,
    allPostsTotalPages,
    setMyPostsPage,
    setAllPostsPage,
    setMyPostsTotalPages,
    setAllPostsTotalPages
  };
}