import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  Pencil,
  Heart,
  Users,
  UserPlus,
  UserX,
  Check,
  Send,
  X,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";
import { Link } from "react-router-dom";

const UserProfile = ({
  userData,
  isUserDataLoading,
}: {
  userData: UserType;
  isUserDataLoading: boolean;
}) => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { data: friendRequest } = useQuery({
    queryKey: ["friendRequest", userData],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/friends/requests/${userData.id}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching receivedFriendRequests:", error.message);
      }
    },
    enabled: !!userData.id,
  });

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/friends/requests/${userData.id}`);
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
      const res = await axiosInstance.delete(`/friends/${userData.id}/remove`);
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

  const isMyProfile = userData.id === authUser?.id;
  const isFriends =
    authUser?.friends1?.some(
      (friend) =>
        friend.user1Id === userData?.id || friend.user2Id === userData?.id
    ) ||
    authUser?.friends2?.some(
      (friend) =>
        friend.user1Id === userData?.id || friend.user2Id === userData?.id
    );
  const isPending = !isFriends && friendRequest?.status === "PENDING";
  const isSentByAuthUser =
    !isFriends && friendRequest?.senderId === authUser?.id;

  return (
    <div className="border rounded-lg shadow-lg">
      {isUserDataLoading ? (
        <Skeleton className="h-52" />
      ) : (
        <>
          <div className="relative">
            <img
              alt={`${userData.username} cover`}
              src={userData.cover}
              className="object-cover rounded-lg h-52 w-full"
            />
            <img
              alt={`${userData.username} avatar`}
              src={userData.avatar}
              className="object-cover rounded-full h-24 w-24 absolute -bottom-10 left-4 border-2"
            />
          </div>
          <div className="pl-32 pr-4 h-14 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">@{userData.username}</p>
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Pencil size={16} />
                <p className="text-sm font-semibold">{userData._count.posts}</p>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <p className="text-sm font-semibold">
                  {userData.likesReceivedCount}
                </p>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1">
                <Users size={16} />
                <p className="text-sm font-semibold">{userData.friendsCount}</p>
              </div>
            </div>
            <div>
              {!isMyProfile && !isFriends && !isPending && (
                <Button onClick={() => sendFriendRequestMutation()} size={"sm"}>
                  <UserPlus />
                  <p>Add Friend</p>
                </Button>
              )}
              {isPending && isSentByAuthUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"}>
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
                    <Button size={"sm"}>
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
                    <Button size={"sm"}>
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
                <Link to={"/settings"}>
                  <Button size={"sm"}>
                    <Settings />
                    <p>Edit Profile</p>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
