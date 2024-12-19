import { User } from "./user";

export interface PostComment {
  id: number;
  text: string;
  authorId: string;
  author: User;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
