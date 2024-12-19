import { Link, useNavigate } from "react-router-dom";
import { useActiveChatContext } from "@/context/ActiveChatContext";
import { useActiveComponentContext } from "@/context/ActiveComponentContext";
import { useSocketContext } from "@/context/SocketContext";
import { useQuery } from "@tanstack/react-query";

import { Mail, User } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";

const YourFriendsCard = () => {
  const { setActiveChat } = useActiveChatContext();
  const { setActiveComponent } = useActiveComponentContext();
  const { onlineUsers } = useSocketContext();
  const navigate = useNavigate();
  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/friends/${authUser?.id}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching friends:", error.message);
      }
    },
    enabled: !!authUser?.id,
  });

  const handleMessageClick = (friend: UserType) => {
    setActiveChat(friend);
    setActiveComponent("ChatWindow");
    navigate("/messages");
  };

  const isOnline = (friendId: string) => onlineUsers.includes(friendId);

  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Your Friends</h2>
        <Link to={`/${authUser?.username}/friends`}>
          <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
            View all
          </Button>
        </Link>
      </div>
      {isFriendsLoading ? (
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
        friends &&
        friends.length > 0 &&
        friends.slice(0, 10).map((friend: UserType) => (
          <div key={friend.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    alt={`${friend.username} avatar`}
                    src={friend.avatar}
                    className="object-cover rounded-full h-9 w-9"
                  />
                  <div
                    className={`absolute bottom-0.5 right-0.5 p-1 rounded-full border ${
                      isOnline(friend.id) ? "bg-green-700" : "bg-red-700"
                    }`}
                  ></div>
                </div>
                <div className="-space-y-0.5">
                  <p className="text-sm font-medium">{friend.username}</p>
                  <p className="text-xs max-w-32">
                    {friend.bio && friend.bio.length > 20
                      ? `${friend.bio.slice(0, 20)}...`
                      : friend.bio}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/${friend.username}`}>
                  <Button variant={"secondary"} className="h-0 w-0 p-3 border">
                    <User />
                  </Button>
                </Link>
                <Button
                  onClick={() => handleMessageClick(friend)}
                  variant={"secondary"}
                  className="h-0 w-0 p-3 border"
                >
                  <Mail />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default YourFriendsCard;
