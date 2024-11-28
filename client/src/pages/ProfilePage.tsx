import BirthdayCard from "@/components/BirthdayCard";
import Feed from "@/components/Feed";
import FriendRequests from "@/components/FriendRequests";
import FriendsList from "@/components/FriendsList";
import UserInformation from "@/components/UserInformation";
import UserMedia from "@/components/UserMedia";
import UserProfile from "@/components/UserProfile";

const ProfilePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex gap-4">
      <div className="hidden md:block w-[40%] space-y-4">
        <UserInformation />
        <FriendsList />
        <UserMedia />
      </div>
      <div className="w-full space-y-4">
        <UserProfile />
        <Feed />
      </div>
      <div className="hidden lg:block w-[40%] space-y-4">
        <FriendRequests />
        <BirthdayCard />
      </div>
    </div>
  );
};

export default ProfilePage;
