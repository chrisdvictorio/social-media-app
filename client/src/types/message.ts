import { User } from "./user";

export interface Message {
  id: number;
  text?: string;
  image?: string;
  senderId: string;
  sender: User;
  conversationId: number;
  read: boolean;
  createdAt: Date;
}
