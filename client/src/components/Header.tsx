import { Link } from "react-router-dom";

import {
  Home,
  Mail,
  Heart,
  Bookmark,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="max-w-7xl mx-auto h-14 flex items-center justify-between ">
      <Link to={"/"}>
        <p>LOGO HERE</p>
      </Link>
      <nav className="hidden md:block">
        <ul className="flex items-center gap-2">
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="py-3 px-8 rounded-lg hover:bg-[#083877] hover:text-white dark:hover:bg-[#3D66A9]"
                  >
                    <Home />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/messages"
                    className="py-3 px-8 rounded-lg hover:bg-[#083877] hover:text-white dark:hover:bg-[#3D66A9]"
                  >
                    <Mail />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="py-3 px-8 rounded-lg hover:bg-[#083877] hover:text-white dark:hover:bg-[#3D66A9]"
                  >
                    <Heart />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Liked Posts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="py-3 px-8 rounded-lg hover:bg-[#083877] hover:text-white dark:hover:bg-[#3D66A9]"
                  >
                    <Bookmark />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Saved Posts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <Bell />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User />
              <p>View Profile</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              <p>Settings</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              <p>Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>@Ishmimi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to={"/"}>
                <User />
                <p>View Profile</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              <p>Settings</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              <p>Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
