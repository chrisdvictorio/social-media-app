import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

import { User as UserType } from "@/types/user";
import { Post as PostType } from "@/types/post";
import axiosInstance from "@/api/axios";

const UserMediaCard = ({ userData }: { userData: UserType }) => {
  const { data: userMedia, isLoading: isUserMediaLoading } = useQuery({
    queryKey: ["userMedia"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/${userData.id}/images`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching userMedia:", error.message);
      }
    },
  });

  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">User Media</h2>
        <Link to={`/${userData.username}/images`} className="flex">
          <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
            View all
          </Button>
        </Link>
      </div>
      {isUserMediaLoading ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {userMedia.slice(0, 6).map((post: PostType) => (
            <Link to={`/posts/${post.id}`} key={post.id}>
              <img
                alt={`${post.author.username} post`}
                src={post.image}
                className="object-cover rounded-lg h-24 w-full "
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMediaCard;
