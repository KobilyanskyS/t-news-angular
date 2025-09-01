import { Component, inject } from '@angular/core';
import { PostComponent } from '../post/post';
import { PostsService } from '../../../services/posts/posts';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-posts-list',
  imports: [PostComponent],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.less'
})
export class PostsListComponent {
private postService = inject(PostsService);
  
  posts: Post[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPostsWithUsers().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }
}
