import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "./ui/skeleton";

import Post from "./Post";

import { User as UserType } from "@/types/user";
import { Post as PostType } from "@/types/post";
import axiosInstance from "@/api/axios";

const UserPosts = ({ userData }: { userData: UserType }) => {
  const { data: userPosts, isLoading: isPostLoading } = useQuery({
    queryKey: ["userPosts", userData.id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/${userData.id}/posts`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching userPosts:", error.message);
      }
    },
    enabled: !!userData.id,
  });

  return (
    <>
      {isPostLoading ? (
        <div className="p-4 border rounded-lg shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1 w-36">
              <Skeleton className="h-3" />
              <Skeleton className="h-3" />
            </div>
          </div>
          <div>
            <Skeleton className="h-72" />
          </div>
        </div>
      ) : (
        userPosts.map((post: PostType) => <Post key={post.id} post={post} />)
      )}
    </>
  );
};

export default UserPosts;
