import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

import FriendRequest from "./FriendRequest";

import { User as UserType } from "@/types/user";
import { FriendRequest as FriendRequestType } from "@/types/friend-request";
import axiosInstance from "@/api/axios";

const FriendRequestsCard = () => {
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const {
    data: receivedFriendRequests,
    isLoading: isReceivedFriendRequestsLoading,
  } = useQuery({
    queryKey: ["receivedFriendRequests"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/friends/requests/received");
        return res.data;
      } catch (error: any) {
        console.error("Error fetching friendRequests:", error.message);
      }
    },
  });

  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Friend Requests</h2>
        <Link to={`/${authUser?.username}/friends/requests`} className="flex">
          <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
            View all
          </Button>
        </Link>
      </div>
      {isReceivedFriendRequestsLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2 w-full">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ) : (
        receivedFriendRequests.length > 0 &&
        receivedFriendRequests
          .slice(0, 2)
          .map((friendRequest: FriendRequestType) => (
            <FriendRequest
              key={friendRequest.id}
              friendRequest={friendRequest}
            />
          ))
      )}
    </div>
  );
};

export default FriendRequestsCard;
