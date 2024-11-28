import { Button } from "./ui/button";

const UserFriendsListCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">Friends</h2>
        <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
          View all
        </Button>
      </div>
      <div className="flex flex-wrap justify-center -space-x-4">
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <img
          alt=""
          src="bethdoe.png"
          className="object-cover rounded-full h-12 w-12 border-2"
        />
        <Button className="object-cover rounded-full h-12 w-12 border-2 flex items-center justify-center">
          <p>7+</p>
        </Button>
      </div>
    </div>
  );
};

export default UserFriendsListCard;
