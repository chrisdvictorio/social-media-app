import BirthdayCard from "@/components/BirthdayCard";
import Feed from "@/components/Feed";
import FriendRequestsCard from "@/components/FriendRequestsCard";
import UserFriendsListCard from "@/components/UserFriendsListCard";
import UserFriendsList from "@/components/UserFriendsList";
import UserInformationCard from "@/components/UserInformationCard";
import UserMediaCard from "@/components/UserMediaCard";
import UserProfile from "@/components/UserProfile";
import UserMedia from "@/components/UserMedia";
import FriendRequests from "@/components/FriendRequests";

const ProfilePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex flex-1 gap-4 mb-4">
      <div className="hidden md:block w-[40%] space-y-4">
        <UserInformationCard />
        <UserFriendsListCard />
        <UserMediaCard />
      </div>
      <div className="w-full">
        <div className="hidden space-y-4">
          <UserProfile />
          <Feed />
        </div>
        <UserFriendsList />
        <UserMedia />
        <FriendRequests />
      </div>
      <div className="hidden lg:block w-[40%] space-y-4">
        <FriendRequestsCard />
        <BirthdayCard />
      </div>
    </div>
  );
};

export default ProfilePage;
