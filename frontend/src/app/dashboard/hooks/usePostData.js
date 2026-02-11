import { useQuery } from "@tanstack/react-query";
import {
  fetchUser,
  getUserPosts,
  getAllPosts,
} from "@/lib/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePostData(pagination) {
  const router = useRouter();
  const { myPostsPage, allPostsPage, setMyPostsTotalPages, setAllPostsTotalPages } = pagination;

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
  };
}