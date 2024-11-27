import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import {
  Bookmark,
  Ellipsis,
  Eye,
  Heart,
  MessageSquare,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Feed = () => {
  return (
    <Tabs defaultValue="account" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="account" className="w-full">
          For You
        </TabsTrigger>
        <TabsTrigger value="password" className="w-full">
          Friends
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="py-4 border rounded-lg shadow-lg space-y-4">
          <div className="px-4 flex items-center justify-between">
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <img
                    alt=""
                    src="bethdoe.png"
                    className="object-cover rounded-full h-9 w-9"
                  />
                  <div className="-space-y-0.5">
                    <p className="text-sm font-semibold">Username</p>
                    <p className="text-sm">12 April at 09:23 PM</p>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    alt=""
                    src="bethdoe.png"
                    className="object-cover rounded-full h-10 w-10"
                  />
                  <div>
                    <p className="text-sm font-semibold">@username</p>
                    <p className="text-xs">
                      Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm
                      a new User 👋 Hello I'm a new User 👋 Hello I'm a new User
                      👋 Hello I'm a new User 👋
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center w-full gap-1 border-r">
                    <Pencil size={16} />
                    <p className="text-sm font-semibold">256</p>
                  </div>
                  <div className="flex items-center w-full gap-1 border-r">
                    <User size={16} />
                    <p className="text-sm font-semibold">256</p>
                  </div>
                  <div className="flex items-center w-full gap-1">
                    <Heart size={16} />
                    <p className="text-sm font-semibold">256</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                  <Eye />
                  <p>View Post</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2 color="rgb(239 68 68 / var(--tw-text-opacity, 1))" />
                  <p className="text-red-500">Delete Post</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <img alt="" src="lifestyle.jpg" />
          <Separator />
          <div className="px-4 flex items-center justify-between">
            <div className="space-x-2">
              <Button variant={"outline"} className="border">
                <Heart />
                <p>Hearts</p>
              </Button>
              <Button variant={"outline"} className="border">
                <MessageSquare />
                <p>Comments</p>
              </Button>
            </div>
            <Button variant={"outline"} className="border">
              <Bookmark />
              <p>Saved</p>
            </Button>
          </div>
          <Separator />
          <div className="px-4 flex items-center gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-9 w-9"
            />
            <Input placeholder="Write your comment..." />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-2 border rounded-lg shadow-lg"></div>
      </TabsContent>
    </Tabs>
  );
};

export default Feed;
