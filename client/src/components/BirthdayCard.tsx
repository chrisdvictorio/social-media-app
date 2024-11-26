import { Button } from "./ui/button";

import { PartyPopper } from "lucide-react";

const BirthdayCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <h2 className="text-sm">Birthdays</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-9 w-9"
            />
            <p className="text-sm font-semibold">Max 15 Characters</p>
          </div>
          <Button className="h-0 w-0 p-3">
            <PartyPopper />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-9 w-9"
            />
            <p className="text-sm font-semibold">Max 15 Characters</p>
          </div>
          <Button className="h-0 w-0 p-3">
            <PartyPopper />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
