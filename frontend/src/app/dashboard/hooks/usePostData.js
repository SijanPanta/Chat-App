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
  const useComments = (postId) => {
    return useQuery({
      queryKey: ["comments", postId],
      queryFn: async () => {
        const res = await getCommentsbyPost(postId);
        return res.data.comments || res.data;
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

  const { data: myPosts = [] } = useQuery({
    queryKey: ["myPosts", user?.userId, myPostsPage],
    queryFn: async () => {
      const postsPerPage = 5;
      const response = await getUserPosts(
        user?.userId,
        myPostsPage,
        postsPerPage,
      );
      const totalPosts = response.posts.count;
      setMyPostsTotalPages(Math.ceil(totalPosts / postsPerPage));
      return response.posts.rows;
    },
    enabled: !!user?.userId,
    keepPreviousData: true,
  });
  const { data: allPosts = [] } = useQuery({
    queryKey: ["allPosts", allPostsPage],
    queryFn: async () => {
      const postsPerPage = 5;
      const response = await getAllPosts(allPostsPage, postsPerPage);
      const totalPosts = response.posts.count;
      setAllPostsTotalPages(Math.ceil(totalPosts / postsPerPage));
      return response.posts.rows;
    },
    keepPreviousData: true,
  });

  return {
    user,
    isLoading,
    error,
    myPosts,
    allPosts,
    useComments,
  };
}
