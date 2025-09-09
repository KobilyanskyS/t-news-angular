import { Post } from "./post";
import { User } from "./user";

export type SearchResult = {
  users: User[];
  posts: Post[];
}