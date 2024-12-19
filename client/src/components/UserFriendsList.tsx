import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

import Friend from "./Friend";

import { User as UserType } from "@/types/user";

const UserFriendsList = ({
  friends,
  isFriendsLoading,
}: {
  friends: UserType[];
  isFriendsLoading: boolean;
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      {friends.length > 0 && (
        <Input className="w-full" placeholder="Search User" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isFriendsLoading ? (
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
          friends.map((friend) => <Friend key={friend.id} friend={friend} />)
        )}
      </div>
    </div>
  );
};

export default UserFriendsList;
