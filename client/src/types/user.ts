import { FriendRequest } from "./friend-request";
import { Friend } from "./friends";

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  cover?: string;
  country: string;
  birthday: string;
  friends1: Friend[];
  friends2: Friend[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  friendsCount: number;
  likesReceivedCount: number;
  _count: {
    posts: number;
  };
  createdAt: Date;
}
