import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/lib/api";

export function useAuth() {
  const router = useRouter();

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    onError: () => {
      localStorage.removeItem("token");
      router.push("/login");
    },
  });
}
