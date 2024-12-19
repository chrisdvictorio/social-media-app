import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Mail, User } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useActiveChatContext } from "@/context/ActiveChatContext";
import { useActiveComponentContext } from "@/context/ActiveComponentContext";

const FindUsersCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setActiveChat } = useActiveChatContext();
  const { setActiveComponent } = useActiveComponentContext();
  const navigate = useNavigate();

  const { data: randomUsers, isLoading: isUsersLoading } = useQuery({
    queryKey: ["randomUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/random");
        return res.data;
      } catch (error: any) {
        console.error("Error fetching userandomUsersrs:", error.message);
      }
    },
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

  const handleMessageClick = (friend: UserType) => {
    setActiveChat(friend);
    setActiveComponent("ChatWindow");
    navigate("/messages");
  };

  const displayList = searchQuery ? searchedUsers : randomUsers;

  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm">Find Users</h2>
        <label htmlFor="searchUser" className="sr-only">
          Search User
        </label>
        <Input
          id="searchUser"
          name="searchUser"
          placeholder="Search User"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-7"
        />
      </div>
      {isUsersLoading || isSearchLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ) : (
        displayList?.map((user: UserType) => (
          <div key={user.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  alt={`${user.username} avatar`}
                  src={user.avatar}
                  className="object-cover rounded-full h-9 w-9"
                />
                <div className="-space-y-0.5 ">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs">
                    {user.bio && user.bio.length > 20
                      ? `${user.bio.slice(0, 20)}...`
                      : user.bio}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/${user.username}`}>
                  <Button variant={"secondary"} className="h-0 w-0 p-3 border">
                    <User />
                  </Button>
                </Link>
                <Button
                  onClick={() => handleMessageClick(user)}
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

export default FindUsersCard;
