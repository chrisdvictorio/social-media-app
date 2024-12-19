import { User } from "./user";

export enum FriendRequestStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
}

export interface FriendRequest {
  id: number;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  status: FriendRequestStatus;
}
