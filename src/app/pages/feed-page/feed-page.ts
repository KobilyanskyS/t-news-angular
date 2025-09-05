import { Component, inject } from '@angular/core';
import { PostsListComponent } from '../../components/posts/posts-list/posts-list';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts/posts';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-feed-page',
  imports: [PostsListComponent],
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.less',
})
export class FeedPage {
  private postService = inject(PostsService);
  private authService = inject(AuthService);

  posts: Post[] = [];
  isLoading = true;
  isAuthenticated = this.authService.isAuthenticated();
  currentUser = this.authService.getUserFromStorage();
  hasSubscriptions =
    !!this.currentUser &&
    Array.isArray(this.currentUser.subscriptions) &&
    this.currentUser.subscriptions.length > 0;

  ngOnInit() {
    if (this.isAuthenticated && this.hasSubscriptions) {
      this.loadSubscriptionsPosts();
    } else {
      this.loadAllPosts();
    }
  }

  loadSubscriptionsPosts() {
    this.postService.getSubscriptionsPosts().subscribe((posts) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  loadAllPosts() {
    this.postService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }
}
