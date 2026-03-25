import { useQuery } from "@tanstack/react-query";
import {
  fetchUser,
  getUserPosts,
  getAllPosts,
  getCommentsbyPost,
} from "@/lib/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePostData(pagination) {
  const router = useRouter();
  const {
    myPostsPage,
    allPostsPage,
    setMyPostsTotalPages,
    setAllPostsTotalPages,
  } = pagination;

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });
  const useComments = (postId, page = 1) => {
    return useQuery({
      queryKey: ["comments", postId, page],
      queryFn: async () => {
        const res = await getCommentsbyPost(postId, page);
        return res.data;
      },
      enabled: !!postId,
      retry: false,
    });
  };
  //fetch comments
  // Handle authentication errors
  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [error, router]);

  const { data: myPostsData = { rows: [], totalPages: 1 } } = useQuery({
    queryKey: ["myPosts", user?.userId, myPostsPage],
    queryFn: async () => {
      const postsPerPage = 10;
      const response = await getUserPosts(
        user?.userId,
        myPostsPage,
        postsPerPage,
      );

      let totalPosts = response?.posts?.count || 0;
      if (Array.isArray(totalPosts)) totalPosts = totalPosts.length;
      const totalPages = Math.ceil(totalPosts / postsPerPage);

      return {
        rows: response?.posts?.rows || [],
        totalPages: totalPages > 0 ? totalPages : 1,
      };
    },
    enabled: !!user?.userId,
  });

  const { data: allPostsData = { rows: [], totalPages: 1 } } = useQuery({
    queryKey: ["allPosts", allPostsPage], 
    queryFn: async () => {
      const postsPerPage = 10;
      const response = await getAllPosts(allPostsPage, postsPerPage);

      let totalPosts = response?.posts?.count || response?.count || 0;
      if (Array.isArray(totalPosts)) totalPosts = totalPosts.length;
      const totalPages = Math.ceil(totalPosts / postsPerPage);

      return {
        rows: response?.posts?.rows || [],
        totalPages: totalPages > 0 ? totalPages : 1,
      };
    },
  });

  useEffect(() => {
    setMyPostsTotalPages(myPostsData.totalPages);
  }, [myPostsData.totalPages, setMyPostsTotalPages]);

  useEffect(() => {
    setAllPostsTotalPages(allPostsData.totalPages);
  }, [allPostsData.totalPages, setAllPostsTotalPages]);

  const myPosts = myPostsData.rows;
  const allPosts = allPostsData.rows;

  return {
    user,
    isLoading,
    error,
    myPosts,
    allPosts,
    useComments,
  };
}
