import { User } from "./user";

export interface Comment {
  id: number;
  userId: number;
  content: string;
  author_name?: string;
  author_avatar?: string;
}