import { Mail, User } from "lucide-react";
import { Button } from "./ui/button";

const YourFriendsCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Your Friends</h2>
        <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-9 w-9"
            />
            <div className="-space-y-0.5">
              <p className="text-sm font-medium">Max 15 Characters</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <User />
            </Button>
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <Mail />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-9 w-9"
            />

            <p className="text-sm font-medium">Max 15 Characters</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <User />
            </Button>
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <Mail />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourFriendsCard;
