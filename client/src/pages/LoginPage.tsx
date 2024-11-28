import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="px-3 flex-1 flex justify-between mb-4">
      <div className="hidden xl:flex items-center justify-center w-full rounded-lg bg-[#F5F5F5] dark:bg-[#262626]">
        <div className="flex flex-col items-center justify-center gap-12 px-16">
          <img alt="" src="logo.png" className="object-cover rounded-lg w-56" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-center">Social Media App</h1>
            <p className="text-lg text-center">
              Connect and share moments with friends and family. Our platform
              lets you stay updated, send messages, and express yourself through
              posts and media.
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="h-12 gap-4">
              <img alt="" src="linkedin.png" className="h-full" />
              <div>
                <p className="text-start text-sm">LinkedIn</p>
                <p className="text-sm font-semibold">@chris-victorio</p>
              </div>
            </Button>
            <Button className="h-12 gap-4">
              <img alt="" src="github.png" className="h-full" />
              <div>
                <p className="text-start text-sm">GitHub</p>
                <p className="text-sm font-semibold">@chrisdvictorio</p>
              </div>
            </Button>
            <Button className="h-12 gap-4">
              <img alt="" src="instagram.png" className="h-full" />
              <div>
                <p className="text-start text-sm">Instagram</p>
                <p className="text-sm font-semibold">@ishmimi_</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full rounded-lg">
        <div className="w-[28rem] space-y-5">
          <h2 className="text-2xl font-semibold text-center">
            Login to your Account
          </h2>
          <form className="space-y-5">
            <div className="space-y-0.5">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                className="placeholder:text-sm"
              />
            </div>
            <div className="space-y-0.5">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••••"
                className="placeholder:text-sm"
              />
            </div>
            <Button className="w-full">Sign In</Button>
          </form>
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <hr className="flex-grow border-t" />
              <span className="text-sm text-muted-foreground">
                Don't have an Account?
              </span>
              <hr className="flex-grow border-t" />
            </div>
            <Link to="/register" className="block w-full">
              <Button variant={"secondary"} className="w-full border">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
