import { Cake, CalendarDays, MapPin, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const UserInformation = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <h2 className="text-sm">User Information</h2>
      <div>
        <p className="text-sm font-semibold">@ishmimi</p>
        <p className="text-xs">
          Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User
          👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new
          User 👋
        </p>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <p className="text-sm">
            Living in <span className="font-medium">Philippines</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Cake size={16} />
          <p className="text-sm">
            Born <span className="font-medium">April 28, 2001</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays size={16} />
          <p className="text-sm">
            Joined <span className="font-medium">November 2024</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <Button className="w-full">
          <Settings />
          <p>Edit Profile</p>
        </Button>
      </div>
    </div>
  );
};

export default UserInformation;
