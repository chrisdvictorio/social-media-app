import { User } from "./user";

export enum NotificationType {
  FRIEND_REQUEST = "FRIEND_REQUEST",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  SAVE = "SAVE",
}

export interface Notification {
  id: number;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  postId?: number;
  friendRequestId?: number;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
