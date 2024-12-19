import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { MapPin, Cake } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

import { User as UserType } from "@/types/user";

const ProfileCard = () => {
  const { data: authUser, isLoading: isAuthUserLoading } = useQuery<UserType>({
    queryKey: ["authUser"],
  });

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      {isAuthUserLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-4" />
        </div>
      ) : (
        <>
          <div className="relative">
            <img
              alt={`${authUser?.username} cover`}
              src={authUser?.cover}
              className="object-cover rounded-md h-24 w-full"
            />
            <img
              alt={`${authUser?.avatar} cover`}
              src={authUser?.avatar}
              className="object-cover rounded-full h-14 w-14 absolute left-1/2 -translate-x-1/2 -bottom-6 border-2"
            />
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-center">
                {authUser?.username}
              </p>
              <p className="text-xs text-center">{authUser?.bio}</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="flex flex-col items-center w-full border-r">
                <p className="text-sm font-semibold">
                  {authUser?._count.posts}
                </p>
                <p className="text-sm">
                  {authUser && authUser?._count.posts > 1 ? "Posts" : "Post"}
                </p>
              </div>

              <div className="flex flex-col items-center w-full border-r">
                <p className="text-sm font-semibold">
                  {authUser?.likesReceivedCount}
                </p>
                <p className="text-sm">
                  {authUser && authUser?.likesReceivedCount > 1
                    ? "Likes"
                    : "Like"}
                </p>
              </div>
              <div className="flex flex-col items-center w-full ">
                <p className="text-sm font-semibold">
                  {authUser?.friendsCount}
                </p>
                <p className="text-sm">
                  {authUser && authUser?.friendsCount > 1
                    ? "Friends"
                    : "Friend"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <MapPin size={20} />
                <p className="text-sm">
                  Country:{" "}
                  <span className="font-medium">{authUser?.country}</span>
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Cake size={20} />
                <p className="text-sm">
                  Birthday:{" "}
                  <span className="font-medium">
                    {authUser?.birthday && formatDate(authUser.birthday)}
                  </span>
                </p>
              </div>
            </div>
            <Separator />
            <Link to={`/${authUser?.username}`} className="flex">
              <Button className="w-full">View Profile</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
