import { Ellipsis, Eye, Smile, Image } from "lucide-react";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";

const ChatWindow = () => {
  return (
    <div className="hidden w-full border rounded-lg shadow-lg sm:flex flex-col justify-between">
      <div className="p-4 border-b flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <img
            alt=""
            src="bethdoe.png"
            className="object-cover rounded-full h-10 w-10"
          />
          <div className="-space-y-0.5">
            <p className="text-sm font-medium">username</p>
            <p className="text-sm">Online</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer">
              <Eye />
              <p>View Profile</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-full p-4">Window</div>
      <div className="flex items-center justify-between p-4 gap-2">
        <div className="flex items-center gap-2">
          <Button variant={"outline"}>
            <Smile />
          </Button>
          <Button variant={"outline"}>
            <Image />
          </Button>
        </div>
        <Input />
        <Button>
          <p>Send</p>
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
