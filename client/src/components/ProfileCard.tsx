import { MapPin, Cake } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const ProfileCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <div className="relative">
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-md h-24 w-full"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-14 w-14 absolute left-1/2 -translate-x-1/2 -bottom-6 border-2"
        />
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-center">Ishmimi</p>
          <p className="text-xs text-center">
            Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User
            👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new
            User 👋
          </p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="flex flex-col items-center w-full border-r">
            <p className="text-sm font-semibold">256</p>
            <p className="text-sm">Posts</p>
          </div>

          <div className="flex flex-col items-center w-full border-r">
            <p className="text-sm font-semibold">256</p>
            <p className="text-sm">Friends</p>
          </div>
          <div className="flex flex-col items-center w-full ">
            <p className="text-sm font-semibold">256</p>
            <p className="text-sm">Likes</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <MapPin size={20} />
            <p className="text-sm">
              Country: <span className="font-medium">Philippines</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Cake size={20} />
            <p className="text-sm">
              Birthday: <span className="font-medium">April 28, 2001</span>
            </p>
          </div>
        </div>
        <Separator />
        <Button className="w-full">View Profile</Button>
      </div>
    </div>
  );
};

export default ProfileCard;
