import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Check, X } from "lucide-react";
import { Button } from "./ui/button";

import { FriendRequest as FriendRequestType } from "@/types/friend-request";
import axiosInstance from "@/api/axios";

const FriendRequest = ({
  friendRequest,
}: {
  friendRequest: FriendRequestType;
}) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await axiosInstance.delete(`/notifications/${userId}/delete`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const handleAcceptFriend = (userId: string) => {
    acceptFriendRequestMutation();
    deleteNotification(userId);
  };

  const handleDeclineFriend = (userId: string) => {
    declineFriendRequestMutation();
    deleteNotification(userId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={`/${friendRequest.sender.username}`}>
          <div className="flex items-center gap-2">
            <img
              alt={`${friendRequest.sender.username} avatar`}
              src={friendRequest.sender.avatar}
              className="object-cover rounded-full h-9 w-9"
            />
            <p className="text-sm font-medium">
              {friendRequest.sender.username}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleAcceptFriend(friendRequest.senderId)}
            className="h-0 w-0 p-3"
          >
            <Check />
          </Button>
          <Button
            onClick={() => handleDeclineFriend(friendRequest.senderId)}
            variant={"secondary"}
            className="h-0 w-0 p-3 border"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
