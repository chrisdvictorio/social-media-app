import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import BirthdayCard from "@/components/FindUsersCard";
import FriendRequestsCard from "@/components/FriendRequestsCard";
import UserFriendsListCard from "@/components/UserFriendsListCard";
import UserInformationCard from "@/components/UserInformationCard";
import UserMediaCard from "@/components/UserMediaCard";
import UserMedia from "@/components/UserMedia";
import UserProfile from "@/components/UserProfile";

import axiosInstance from "@/api/axios";

const UserMediaPage = () => {
  const { username } = useParams();

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["userData", username],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/users/${username}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching userData:", error.message);
      }
    },
    enabled: !!username,
  });

  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends", userData],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/friends/${userData?.id}`);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching friends:", error.message);
      }
    },
    enabled: !!userData?.id,
  });

  if (isUserDataLoading || isFriendsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 w-full flex flex-1 gap-4 mb-4">
      <div className="hidden md:block w-[40%] space-y-4">
        <UserInformationCard
          userData={userData}
          isUserDataLoading={isUserDataLoading}
        />
        <UserFriendsListCard
          userData={userData}
          friends={friends}
          isFriendsLoading={isFriendsLoading}
        />
        <UserMediaCard userData={userData} />
      </div>
      <div className="w-full space-y-4">
        <UserProfile
          userData={userData}
          isUserDataLoading={isUserDataLoading}
        />
        <UserMedia userData={userData} />
      </div>
      <div className="hidden lg:block w-[40%] space-y-4">
        <FriendRequestsCard />
        <BirthdayCard />
      </div>
    </div>
  );
};

export default UserMediaPage;
