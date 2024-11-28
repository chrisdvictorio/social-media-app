import { Eye, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const UserFriendsList = () => {
  return (
    <div className="hidden p-4 border rounded-lg shadow-lg space-y-4">
      <h2 className="w-full">(max 15 characters's) Friends</h2>
      <Input className="w-full" placeholder="Search User" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
          <div className="flex gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-10 w-10"
            />
            <div>
              <p className="text-sm font-medium">username</p>
              <p className="text-xs">
                Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new
                User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello
                I'm a new User 👋
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size={"sm"} className="w-full border">
              <Eye />
              <p>View Profile</p>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-full border dark:hover:bg-[#202020]"
            >
              <UserPlus />
              <p>Add Friend</p>
            </Button>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
          <div className="flex gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-10 w-10"
            />
            <div>
              <p className="text-sm font-medium">username</p>
              <p className="text-xs">
                Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new
                User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello
                I'm a new User 👋
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size={"sm"} className="w-full border">
              <Eye />
              <p>View Profile</p>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-full border dark:hover:bg-[#202020]"
            >
              <UserPlus />
              <p>Add Friend</p>
            </Button>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between rounded-lg gap-4 bg-[#F5F5F5] dark:bg-[#262626]">
          <div className="flex gap-2">
            <img
              alt=""
              src="bethdoe.png"
              className="object-cover rounded-full h-10 w-10"
            />
            <div>
              <p className="text-sm font-medium">username</p>
              <p className="text-xs">
                Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new
                User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello
                I'm a new User 👋
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size={"sm"} className="w-full border">
              <Eye />
              <p>View Profile</p>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-full border dark:hover:bg-[#202020]"
            >
              <UserPlus />
              <p>Add Friend</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFriendsList;
