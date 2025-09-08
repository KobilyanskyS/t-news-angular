import { User } from "./user";
import { Comment } from "./comment";

export type Post = {
  id: number;
  content: string;
  likes: number[];
  comments: Comment[];
  commentsCount: number;
  author_id: number;
  author_name: User["name"];
  author_login: User["login"];
  author_avatar: User["avatar"];
}