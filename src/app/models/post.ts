import { User } from "./user";
import { Comment } from "./comment";

export type Post = {
  id: number;
  content: string;
  author_id: number;
  likes: number[];
  comments: Comment[];
  author_name: User["name"];
  author_avatar: User["avatar"];
}