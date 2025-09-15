import { User } from "./user";

export type Comment = {
  id: number;
  userId: number;
  content: string;
  author_name: User["name"];
  author_avatar: User["avatar"];
  created_at?: string;
}