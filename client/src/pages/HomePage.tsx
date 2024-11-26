import AddPost from "@/components/AddPost";
import BirthdayCard from "@/components/BirthdayCard";
import { Calendar } from "@/components/ui/calendar";

import Feed from "@/components/Feed";
import FriendRequests from "@/components/FriendRequests";
import ProfileCard from "@/components/ProfileCard";
import FriendsList from "@/components/FriendsList";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex justify-between gap-4">
      <div className="hidden lg:block w-[40%] space-y-4">
        <ProfileCard />
        <Calendar
          mode="single"
          className="py-4 border rounded-lg shadow-lg flex items-center justify-center"
        />
      </div>
      <div className="w-full space-y-4">
        <AddPost />
        <Feed />
      </div>
      <div className="hidden md:flex flex-col w-[40%] space-y-4">
        <FriendRequests />
        <BirthdayCard />
        <FriendsList />
      </div>
    </div>
  );
};

export default HomePage;
