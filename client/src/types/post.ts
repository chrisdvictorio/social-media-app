import { User } from "./user";
import { PostComment } from "./comment";
import { Like } from "./like";
import { Bookmark } from "./bookmark";

export interface Post {
  id: number;
  text?: string;
  image?: string;
  authorId: string;
  author: User;
  comments: PostComment[];
  likes: Like[];
  bookmarks: Bookmark[];
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  createdAt: Date;
}
