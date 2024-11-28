import { Input } from "./ui/input";

const ContactList = () => {
  return (
    <div className="w-full sm:w-[30%] py-4 border rounded-lg shadow-lg space-y-4">
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm">Contact List</h2>
        </div>
        <Input placeholder="Search User" />
      </div>

      <div className="px-1 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-200">
          <img
            alt=""
            src="bethdoe.png"
            className="object-cover rounded-full h-10 w-10"
          />
          <div className="-space-y-0.5">
            <p className="text-sm font-medium">max 15 characters</p>
            <p className="text-sm">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-200">
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
      </div>
    </div>
  );
};

export default ContactList;
