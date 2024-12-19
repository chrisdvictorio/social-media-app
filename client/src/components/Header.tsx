import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  Home,
  Mail,
  Heart,
  Bookmark,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

import { User as UserType } from "@/types/user";
import { Notification as NotificationType } from "@/types/notification";
import axiosInstance from "@/api/axios";

const Header = () => {
  const [activeNav, setActiveNav] = useState("");
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        return res.data;
      } catch (error: any) {
        console.error("Error fetching notifications:", error.message);
      }
    },
  });

  const { data: readNotificationsCount } = useQuery({
    queryKey: ["readNotificationsCount"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notifications/count");
        return res.data;
      } catch (error: any) {
        console.error("Error fetching readNotificationsCount:", error.message);
      }
    },
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
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

  const { mutate: readNotificationMutation } = useMutation({
    mutationFn: async (notificationId: number) => {
      const res = await axiosInstance.patch(`/notifications/${notificationId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["readNotificationsCount"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
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
    deleteNotificationMutation(userId);
  };

  const handleDeclineFriend = (friendRequestId: number, userId: string) => {
    declineFriendRequestMutation(friendRequestId);
    deleteNotificationMutation(userId);
  };

  return (
    <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
      <Link to={"/"} className="flex items-center gap-2">
        <img alt="logo" src="/logo.png" className="size-5" />
        <p className="font-bold">SMA</p>
      </Link>
      <nav className="hidden md:block">
        <ul className="flex items-center gap-2">
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className={`py-3 px-8 rounded-lg hover:bg-[#171717] hover:text-[#FAFAFA] dark:hover:bg-[#FAFAFA] dark:hover:text-[#171717] ${
                      activeNav === "Home" &&
                      "bg-[#171717] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#171717]"
                    }`}
                    onClick={() => setActiveNav("Home")}
                  >
                    <Home />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/messages"
                    className={`py-3 px-8 rounded-lg hover:bg-[#171717] hover:text-[#FAFAFA] dark:hover:bg-[#FAFAFA] dark:hover:text-[#171717] ${
                      activeNav === "Messages" &&
                      "bg-[#171717] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#171717]"
                    }`}
                    onClick={() => setActiveNav("Messages")}
                  >
                    <Mail />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/likes"
                    className={`py-3 px-8 rounded-lg hover:bg-[#171717] hover:text-[#FAFAFA] dark:hover:bg-[#FAFAFA] dark:hover:text-[#171717] ${
                      activeNav === "Likes" &&
                      "bg-[#171717] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#171717]"
                    }`}
                    onClick={() => setActiveNav("Likes")}
                  >
                    <Heart />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Liked Posts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/saved"
                    className={`py-3 px-8 rounded-lg hover:bg-[#171717] hover:text-[#FAFAFA] dark:hover:bg-[#FAFAFA] dark:hover:text-[#171717] ${
                      activeNav === "Saved" &&
                      "bg-[#171717] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#171717]"
                    }`}
                    onClick={() => setActiveNav("Saved")}
                  >
                    <Bookmark />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Saved Posts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Button variant={"outline"} size={"icon"}>
                <Bell />
              </Button>
              {authUser && readNotificationsCount > 0 && (
                <Button className="absolute -top-0.5 -right-0.5 w-0 h-0 p-2 rounded-full text-center text-xs">
                  {readNotificationsCount}
                </Button>
              )}
            </div>
          </DropdownMenuTrigger>
          {authUser && (
            <DropdownMenuContent>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications &&
                notifications.map((notification: NotificationType) => {
                  if (notification.type === "FRIEND_REQUEST") {
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() =>
                          readNotificationMutation(notification.id)
                        }
                        className={`cursor-pointer mt-2 ${
                          notification.read === false
                            ? "bg-[#F5F5F5] dark:bg-[#262626] dark:hover:bg-[#262626]"
                            : "bg-[#FFFFFF] dark:bg-[#0A0A0A] dark:hover:bg-[#262626]"
                        }`}
                      >
                        <img
                          alt={`${notification.sender.username} avatar`}
                          src={notification.sender.avatar}
                          className="object-cover rounded-full w-9 h-9"
                        />
                        <div className="space-y-2">
                          <p>{notification.message}</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notification.friendRequestId) {
                                  handleAcceptFriend(
                                    notification.friendRequestId,
                                    notification.senderId
                                  );
                                }
                              }}
                              className="h-0 w-full p-3 relative z-50"
                            >
                              <p>Confirm</p>
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notification.friendRequestId) {
                                  handleDeclineFriend(
                                    notification.friendRequestId,
                                    notification.senderId
                                  );
                                }
                              }}
                              variant={"secondary"}
                              className="h-0 w-full border p-3 relative z-50"
                            >
                              <p>Decline</p>
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  }

                  if (
                    notification.type === "LIKE" ||
                    notification.type === "COMMENT" ||
                    notification.type === "SAVE"
                  ) {
                    return (
                      <Link
                        to={`/posts/${notification.postId}`}
                        key={notification.id}
                        onClick={() =>
                          readNotificationMutation(notification.id)
                        }
                      >
                        <DropdownMenuItem
                          className={`cursor-pointer mt-2 ${
                            notification.read === false
                              ? "bg-[#F5F5F5] dark:bg-[#262626] dark:hover:bg-[#262626]"
                              : "bg-[#FFFFFF] dark:bg-[#0A0A0A] dark:hover:bg-[#262626]"
                          }`}
                        >
                          <img
                            alt={`${notification.sender.username} avatar`}
                            src={notification.sender.avatar}
                            className="object-cover rounded-full w-9 h-9"
                          />
                          <div className="space-y-2">
                            <p>{notification.message}</p>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    );
                  }

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => readNotificationMutation(notification.id)}
                      className={`cursor-pointer mt-2 ${
                        notification.read === false
                          ? "bg-[#F5F5F5] dark:bg-[#262626] dark:hover:bg-[#262626]"
                          : "bg-[#FFFFFF] dark:bg-[#0A0A0A] dark:hover:bg-[#262626]"
                      }`}
                    >
                      <img
                        alt={`${notification.sender.username} avatar`}
                        src={notification.sender.avatar}
                        className="object-cover rounded-full w-9 h-9"
                      />
                      <div className="space-y-2">
                        <p>{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <User />
            </Button>
          </DropdownMenuTrigger>
          {authUser && (
            <DropdownMenuContent>
              <DropdownMenuLabel>@{authUser?.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to={`/${authUser?.username}`}>
                  <User />
                  <p>View Profile</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to={"/settings"}>
                  <Settings />
                  <p>Settings</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutMutation()}
                className="cursor-pointer"
              >
                <LogOut />
                <p>Sign Out</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
