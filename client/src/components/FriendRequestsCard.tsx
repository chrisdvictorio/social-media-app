import { Button } from "./ui/button";

import { Check, X } from "lucide-react";

const FriendRequestsCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Friend Requests</h2>
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
            <p className="text-sm font-medium">Max 15 Characters</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="h-0 w-0 p-3">
              <Check />
            </Button>
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <X />
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
            <Button className="h-0 w-0 p-3">
              <Check />
            </Button>
            <Button variant={"secondary"} className="h-0 w-0 p-3 border">
              <X />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestsCard;
