import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Eye, UserPlus, UserX, Check, Send, X, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";

const Friend = ({ friend }: { friend: UserType }) => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { data: friendRequest } = useQuery({
    queryKey: ["friendRequest", friend],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/friends/requests/${friend.id}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching receivedFriendRequests:", error.message);
      }
    },
    enabled: !!friend.id,
  });

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/friends/requests/${friend.id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/friends/requests/${friendRequest.id}/accept`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["receivedFriendRequests"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: declineFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/friends/requests/${friendRequest.id}/decline`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["receivedFriendRequests"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: cancelFriendRequest } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/friends/requests/${friendRequest.id}/cancel`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: removeFriendMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/friends/${friend.id}/remove`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const isMyProfile = friend.id === authUser?.id;
  const isFriends =
    authUser?.friends1?.some(
      (user) => user.user1Id === friend?.id || user.user2Id === friend?.id
    ) ||
    authUser?.friends2?.some(
      (user) => user.user1Id === friend?.id || user.user2Id === friend?.id
    );
  const isPending = !isFriends && friendRequest?.status === "PENDING";
  const isSentByAuthUser =
    !isFriends && friendRequest?.senderId === authUser?.id;

  return (
    <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
      <div className="flex gap-2">
        <img
          alt={`${friend.username} avatar`}
          src={friend.avatar}
          className="object-cover rounded-full h-10 w-10"
        />
        <div>
          <p className="text-sm font-medium">@{friend.username}</p>
          <p className="text-xs">
            {friend.bio && friend.bio.length > 120
              ? `${friend.bio?.slice(0, 120)}...`
              : friend.bio}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link to={`/${friend.username}`} className="w-full">
          <Button size={"sm"} className="w-full border">
            <Eye />
            <p>View Profile</p>
          </Button>
        </Link>
        {!isMyProfile && !isFriends && !isPending && (
          <Button
            onClick={() => sendFriendRequestMutation()}
            variant={"outline"}
            size={"sm"}
            className="w-full border"
          >
            <UserPlus />
            <p>Add Friend</p>
          </Button>
        )}
        {isPending && isSentByAuthUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="w-full border">
                <Send />
                <p>Request Sent</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => cancelFriendRequest()}
                className="cursor-pointer"
              >
                <X color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                <p className="text-red-500">Cancel Request</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isPending && !isSentByAuthUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="w-full border">
                <UserPlus />
                <p>Respond</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                <Button
                  onClick={() => acceptFriendRequestMutation()}
                  size={"sm"}
                >
                  <Check />
                  <p>Confirm</p>
                </Button>
                <Button
                  onClick={() => declineFriendRequestMutation()}
                  variant={"outline"}
                  size={"sm"}
                >
                  <X />
                  <p>Decline</p>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isMyProfile && isFriends && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="w-full border">
                <Check />
                <p>Friends</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => removeFriendMutation()}
                className="cursor-pointer"
              >
                <UserX color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                <p className="text-red-500">Remove Friend</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isMyProfile && (
          <Link to={"/settings"} className="w-full">
            <Button variant={"outline"} size={"sm"} className="w-full border">
              <Settings />
              <p>Edit Profile</p>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Friend;
