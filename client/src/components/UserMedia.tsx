import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "./ui/skeleton";

import { User as UserType } from "@/types/user";
import { Post as PostType } from "@/types/post";
import axiosInstance from "@/api/axios";

const UserMedia = ({ userData }: { userData: UserType }) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isUserMediaLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          userMedia.map((post: PostType) => (
            <Link to={`/posts/${post.id}`} key={post.id}>
              <img
                alt="post image"
                src={post.image}
                className="object-cover rounded-lg h-32"
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default UserMedia;
