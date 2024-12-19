import { Link } from "react-router-dom";

import { User, Cake, CalendarDays, MapPin } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

import { User as UserType } from "@/types/user";

const UserInformationCard = ({
  userData,
  isUserDataLoading,
}: {
  userData: UserType;
  isUserDataLoading: boolean;
}) => {
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
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">User Information</h2>
        <Link to={`/${userData.username}`} className="flex">
          <Button className="h-0 w-0 p-[10px]">
            <User />
          </Button>
        </Link>
      </div>
      {isUserDataLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-4" />
        </div>
      ) : (
        <>
          <div>
            <p className="text-sm font-semibold">@{userData.username}</p>
            <p className="text-xs">{userData.bio}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <p className="text-sm">
                Living in{" "}
                <span className="font-medium">{userData.country}</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Cake size={16} />
              <p className="text-sm">
                Born{" "}
                <span className="font-medium">
                  {formatDate(userData.birthday.toLocaleString())}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays size={16} />
              <p className="text-sm">
                Joined{" "}
                <span className="font-medium">
                  {formatDate(userData.createdAt.toLocaleString())}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInformationCard;
