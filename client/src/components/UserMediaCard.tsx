import { Button } from "./ui/button";

const UserMediaCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">User Media</h2>
        <Button variant={"link"} size={"sm"} className="h-0 w-0 px-4">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-24 w-full "
        />
      </div>
    </div>
  );
};

export default UserMediaCard;
