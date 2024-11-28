import { Pencil, Heart, Users, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const UserProfile = () => {
  return (
    <div className="border rounded-lg shadow-lg">
      <div className="relative">
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-52 w-full"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-24 w-24 absolute -bottom-10 left-4 border-2"
        />
      </div>
      <div className="pl-32 pr-4 h-14 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">@max 15 characters</p>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Pencil size={16} />
            <p className="text-sm font-semibold">256</p>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <p className="text-sm font-semibold">256</p>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Users size={16} />
            <p className="text-sm font-semibold">256</p>
          </div>
        </div>
        <Button size={"sm"}>
          <UserPlus />
          <p>Request Sent</p>
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
