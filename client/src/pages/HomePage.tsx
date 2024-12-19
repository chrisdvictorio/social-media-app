import AddPost from "@/components/AddPost";
import FindUsersCard from "@/components/FindUsersCard";
import { Calendar } from "@/components/ui/calendar";
import Feed from "@/components/Feed";
import FriendRequestsCard from "@/components/FriendRequestsCard";
import ProfileCard from "@/components/ProfileCard";
import YourFriendsCard from "@/components/YourFriendsCard";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex flex-1 gap-4 mb-4">
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
        <FindUsersCard />
        <FriendRequestsCard />
        <YourFriendsCard />
      </div>
    </div>
  );
};

export default HomePage;
