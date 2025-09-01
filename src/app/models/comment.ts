import { User } from "./user";

export interface Comment {
  id: number;
  userId: number;
  content: string;
  author_name: User["name"];
  author_avatar: User["avatar"];
}