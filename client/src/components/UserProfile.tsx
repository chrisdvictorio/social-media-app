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
          className="object-cover rounded-full h-24 w-24 absolute -bottom-10 left-10 border-2"
        />
      </div>
      <div className="px-4 h-14 ml-32 flex items-center justify-between">
        <p className="underline font-semibold">ishmimi</p>
        <div className="flex items-center gap-2">
          <p>
            <span className="font-semibold">0</span> Posts
          </p>
          <Separator orientation="vertical" className="h-6" />
          <p>
            <span className="font-semibold">0</span> Likes
          </p>
          <Separator orientation="vertical" className="h-6" />
          <p>
            <span className="font-semibold">0</span> Friends
          </p>
        </div>
        <Button size={"sm"}>Add Friend</Button>
      </div>
    </div>
  );
};

export default UserProfile;
