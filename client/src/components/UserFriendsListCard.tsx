import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { User as UserType } from "@/types/user";

const UserFriendsListCard = ({
  userData,
  friends,
  isFriendsLoading,
}: {
  userData: UserType;
  friends: UserType[];
  isFriendsLoading: boolean;
}) => {
  const visibleFriends = friends && friends.slice(0, 6);
  const remainingFriends = friends && friends.length - visibleFriends.length;

  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Friends</h2>
        <Link to={`/${userData.username}/friends`} className="flex">
          <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
            View all
          </Button>
        </Link>
      </div>
      {isFriendsLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <div className="flex flex-wrap justify-center -space-x-4">
          {visibleFriends.map((friend: UserType) => (
            <Link to={`/${friend.username}`} key={friend.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      alt={friend.username}
                      src={friend.avatar}
                      className="object-cover rounded-full h-12 w-12 border-2"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{friend.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          ))}
          {remainingFriends > 0 && (
            <Link to={`/${userData.username}/friends`} className="flex">
              <Button className="object-cover rounded-full h-12 w-12 border-2 flex items-center justify-center">
                <p>{remainingFriends}+</p>
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFriendsListCard;
