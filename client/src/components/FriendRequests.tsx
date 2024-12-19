import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Eye, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FriendRequest as FriendRequestType } from "@/types/friend-request";
import axiosInstance from "@/api/axios";
import { Link } from "react-router-dom";

const FriendRequests = () => {
  const queryClient = useQueryClient();

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
        console.error("Error fetching receivedFriendRequests:", error.message);
      }
    },
  });

  const { data: sentFriendRequests, isLoading: isSentFriendRequestsLoading } =
    useQuery({
      queryKey: ["sentFriendRequests"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/friends/requests/sent");
          return res.data;
        } catch (error: any) {
          console.error("Error fetching sentFriendRequests:", error.message);
        }
      },
    });

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationFn: async (friendRequestId: number) => {
      const res = await axiosInstance.post(
        `/friends/requests/${friendRequestId}/accept`
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
    mutationFn: async (friendRequestId: number) => {
      const res = await axiosInstance.delete(
        `/friends/requests/${friendRequestId}/decline`
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

  const { mutate: cancelFriendRequest } = useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/friends/requests/${id}/cancel`);
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

  const handleAcceptFriend = (friendRequestId: number, userId: string) => {
    acceptFriendRequestMutation(friendRequestId);
    deleteNotification(userId);
  };

  const handleDeclineFriend = (friendRequestId: number, userId: string) => {
    declineFriendRequestMutation(friendRequestId);
    deleteNotification(userId);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <Tabs defaultValue="received" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="w-full">Your Friend Requests</h2>
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="received" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isReceivedFriendRequestsLoading ? (
              <>
                <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-48 space-y-2">
                      <Skeleton className="h-4 " />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-48 space-y-2">
                      <Skeleton className="h-4 " />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              receivedFriendRequests.length > 0 &&
              receivedFriendRequests.map((friendRequest: FriendRequestType) => (
                <div
                  key={friendRequest.id}
                  className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]"
                >
                  <Link
                    to={`/${friendRequest.sender.username}`}
                    className="flex gap-2"
                  >
                    <img
                      alt={`${friendRequest.sender.username} avatar`}
                      src={friendRequest.sender.avatar}
                      className="object-cover rounded-full h-10 w-10"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {friendRequest.sender.username}
                      </p>
                      <p className="text-xs">{friendRequest.sender.bio}</p>
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleAcceptFriend(
                          friendRequest.id,
                          friendRequest.senderId
                        )
                      }
                      size={"sm"}
                      className="w-full border"
                    >
                      <Check />
                      Confirm
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeclineFriend(
                          friendRequest.id,
                          friendRequest.senderId
                        )
                      }
                      size={"sm"}
                      variant={"outline"}
                      className="w-full border dark:hover:bg-[#202020]"
                    >
                      <X />
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="sent" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isSentFriendRequestsLoading ? (
              <>
                <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-48 space-y-2">
                      <Skeleton className="h-4 " />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-48 space-y-2">
                      <Skeleton className="h-4 " />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              sentFriendRequests.length > 0 &&
              sentFriendRequests.map((friendRequest: FriendRequestType) => (
                <div
                  key={friendRequest.id}
                  className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]"
                >
                  <div className="flex gap-2">
                    <img
                      alt={`${friendRequest.receiver.username} avatar`}
                      src={friendRequest.receiver.avatar}
                      className="object-cover rounded-full h-10 w-10"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {friendRequest.receiver.username}
                      </p>
                      <p className="text-xs">{friendRequest.receiver.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/${friendRequest.receiver.username}`}
                      className="w-full"
                    >
                      <Button size={"sm"} className="w-full border">
                        <Eye />
                        View Profile
                      </Button>
                    </Link>

                    <Button
                      onClick={() => cancelFriendRequest(friendRequest.id)}
                      size={"sm"}
                      variant={"outline"}
                      className="w-full border dark:hover:bg-[#202020]"
                    >
                      <X />
                      Cancel Request
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendRequests;
