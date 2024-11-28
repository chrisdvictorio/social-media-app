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
            className="object-cover h-[7.5rem] md:h-44 w-full rounded-lg"
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
              <label htmlFor="profilePicture" className="text-sm">
                Profile Picture
              </label>
              <Input
                id="profilePicture"
                name="profilePicture"
                placeholder="•••••••••"
                className="placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="coverPhoto" className="text-sm">
                Cover Photo
              </label>
              <Input
                id="coverPhoto"
                name="coverPhoto"
                placeholder="•••••••••"
                className="placeholder:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="text-sm">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="ishmimi"
              className="placeholder:text-sm"
            />
          </div>
          <div>
            <label htmlFor="bio" className="text-sm">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋 Hello I'm a new User 👋"
              className="placeholder:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="chrisdvictorio@email.com"
              className="placeholder:text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="country" className="text-sm">
                Country
              </label>
              <Input
                id="country"
                name="country"
                placeholder="Philippines"
                className="placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="text-sm">
                Birthday
              </label>
              <Input
                id="birthday"
                name="birthday"
                placeholder="04/28/2001"
                className="placeholder:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••••"
                className="placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="•••••••••"
                className="placeholder:text-sm"
              />
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
