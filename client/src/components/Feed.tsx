import { useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "./ui/skeleton";

import Post from "./Post";

import { Post as PostType } from "@/types/post";
import axiosInstance from "@/api/axios";

const Feed = () => {
  const { data: posts, isLoading: isPostLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        return res.data;
      } catch (error: any) {
        console.error("Error in fetching posts:", error.message);
      }
    },
  });

  const { data: friendsPosts, isLoading: isFriendsPostLoading } = useQuery({
    queryKey: ["friendsPosts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts/friends");
        return res.data;
      } catch (error: any) {
        console.error("Error in fetching friendsPosts:", error.message);
      }
    },
  });

  if (isPostLoading || isFriendsPostLoading) {
    return <div>loading</div>;
  }

  return (
    <Tabs defaultValue="posts" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="posts" className="w-full">
          For You
        </TabsTrigger>
        <TabsTrigger value="friendsPosts" className="w-full">
          Friends
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
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
          posts.length > 0 &&
          posts?.map((post: PostType) => <Post key={post.id} post={post} />)
        )}
      </TabsContent>
      <TabsContent value="friendsPosts">
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
          friendsPosts.length > 0 &&
          friendsPosts?.map((post: PostType) => (
            <Post key={post.id} post={post} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Feed;
