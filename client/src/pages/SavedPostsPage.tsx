import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";

import FindUsersCard from "@/components/FindUsersCard";
import { Calendar } from "@/components/ui/calendar";
import FriendRequestsCard from "@/components/FriendRequestsCard";
import ProfileCard from "@/components/ProfileCard";
import YourFriendsCard from "@/components/YourFriendsCard";
import Post from "@/components/Post";

import { Post as PostType } from "@/types/post";
import axiosInstance from "@/api/axios";

const SavedPostsPage = () => {
  const { data: savedPosts, isLoading: isSavedPostLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts/saved");
        return res.data;
      } catch (error: any) {
        console.error("Error in fetching likedPosts:", error.message);
      }
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex flex-1 gap-4 mb-4">
      <div className="hidden lg:block w-[40%] space-y-4">
        <ProfileCard />
        <Calendar
          mode="single"
          className="py-4 border rounded-lg shadow-lg flex items-center justify-center"
        />
      </div>
      <div className="w-full space-y-4">
        {isSavedPostLoading ? (
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
          savedPosts.length > 0 &&
          savedPosts.map((post: PostType) => <Post key={post.id} post={post} />)
        )}
      </div>
      <div className="hidden md:flex flex-col w-[40%] space-y-4">
        <FindUsersCard />
        <FriendRequestsCard />
        <YourFriendsCard />
      </div>
    </div>
  );
};

export default SavedPostsPage;
