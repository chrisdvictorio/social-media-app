import { useState } from "react";
import { useActiveChatContext } from "@/context/ActiveChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";
import { useActiveComponentContext } from "@/context/ActiveComponentContext";

const ContactList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { activeChat, setActiveChat } = useActiveChatContext();
  const { setActiveComponent } = useActiveComponentContext();
  const { onlineUsers } = useSocketContext();
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

  const { data: searchedUsers, isLoading: isSearchLoading } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      try {
        const res = await axiosInstance.get(
          `/users/search?query=${searchQuery}`
        );
        return res.data;
      } catch (error: any) {
        console.error("Error fetching search results:", error.message);
        return [];
      }
    },
    enabled: !!searchQuery,
    refetchOnWindowFocus: false,
  });

  const handleFriendClick = (friend: UserType) => {
    setActiveComponent("ChatWindow");
    setActiveChat(friend);
  };

  const isOnline = (friendId: string) => onlineUsers.includes(friendId);

  const displayList = searchQuery ? searchedUsers : friends;

  return (
    <div className="w-full sm:w-[30%] py-4 border rounded-lg shadow-lg space-y-4">
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm">Contact List</h2>
        </div>
        <label htmlFor="searchUser" className="sr-only">
          Search User
        </label>
        <Input
          id="searchUser"
          name="searchuser"
          placeholder="Search User"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="px-1 space-y-2">
        {isFriendsLoading || isSearchLoading ? (
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
          </>
        ) : displayList && displayList.length > 0 ? (
          displayList.map((user: UserType) => (
            <div
              key={user.id}
              onClick={() => handleFriendClick(user)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#262626] ${
                activeChat?.id === user.id && "bg-[#F5F5F5] dark:bg-[#262626]"
              }`}
            >
              <div className="relative">
                <img
                  alt={`${user.username} avatar`}
                  src={user.avatar}
                  className="object-cover rounded-full h-10 w-10"
                />
                <div
                  className={`absolute bottom-0.5 right-0.5 p-1 rounded-full border ${
                    isOnline(user.id) ? "bg-green-700" : "bg-red-700"
                  }`}
                ></div>
              </div>
              <div className="-space-y-0.5">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-sm">
                  {isOnline(user.id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ContactList;
