import { inject, Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { Post } from '../../models/post';
import { ApiService } from '../api/api';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private api = inject(ApiService);

  getAllPosts() {
    return forkJoin({
      posts: this.api.get<Post[]>('posts.json'),
      users: this.api.get<User[]>('users.json'),
    }).pipe(
      map(({ posts, users }) => {
        return posts.map((post) => ({
          ...post,
          author_name: this.findUserName(users, post.author_id),
          author_avatar: this.findUserAvatar(users, post.author_id),
          comments: this.enrichComments(post.comments, users)
        }));
      })
    );
  }

  getSubscriptionsPosts() {
    return forkJoin({
      posts: this.api.get<Post[]>('api/posts'),
      users: this.api.get<User[]>('users.json'),
    }).pipe(
      map(({ posts, users }) => {
        return posts.map((post) => ({
          ...post,
          author_name: this.findUserName(users, post.author_id),
          author_avatar: this.findUserAvatar(users, post.author_id),
          comments: this.enrichComments(post.comments, users)
        }));
      })
    );
  }

  private enrichComments(comments: Comment[], users: User[]): Comment[] {
  return comments.map(comment => ({
    ...comment,
    author_name: this.findUserName(users, comment.userId),
    author_avatar: this.findUserAvatar(users, comment.userId,)
  }));
}

  private findUserName(users: User[], userId: number): string {
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Пользователь';
  }

  private findUserAvatar(users: User[], userId: number): string {
    const user = users.find((u) => u.id === userId);
    return user?.avatar || '/Profile.svg';
  }
}
