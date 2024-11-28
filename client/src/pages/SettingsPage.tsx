import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const SettingsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 flex-1 flex items-center justify-center mb-4">
      <div className="border rounded-lg shadow-lg">
        <div className="relative">
          <img
            alt=""
            src="lifestyle.jpg"
            className="object-cover h-44 w-full rounded-lg"
          />
          <img
            alt=""
            src="bethdoe.png"
            className="object-cover rounded-full h-24 w-24 absolute -bottom-10 left-1/2 transform -translate-x-1/2 border-2"
          />
        </div>
        <form autoComplete="off" className="p-4 mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm">Profile Picture</label>
              <Input placeholder="•••••••••" />
            </div>
            <div>
              <label className="text-sm">Cover Photo</label>
              <Input placeholder="•••••••••" />
            </div>
          </div>
          <div>
            <label className="text-sm">Username</label>
            <Input placeholder="ishmimi" />
          </div>
          <div>
            <label className="text-sm">Bio</label>
            <Textarea
              rows={3}
              placeholder="Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋"
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input placeholder="chrisdvictorio@email.com" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm">Country</label>
              <Input placeholder="Philippines" />
            </div>
            <div>
              <label className="text-sm">Birthday</label>
              <Input placeholder="04/28/2001" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm">Password</label>
              <Input placeholder="•••••••••" />
            </div>
            <div>
              <label className="text-sm">Confirm Password</label>
              <Input placeholder="•••••••••" />
            </div>
          </div>
          <Separator />
          <div className="flex gap-4">
            <Button variant={"secondary"} className="w-full border">
              Cancel
            </Button>
            <Button className="w-full">Edit Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
