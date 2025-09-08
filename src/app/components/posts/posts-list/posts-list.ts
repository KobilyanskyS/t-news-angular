import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostComponent } from '../post/post';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-posts-list',
  imports: [PostComponent],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.less',
})
export class PostsListComponent {
  @Input() posts!: Post[];
  @Output() postDeleted = new EventEmitter<number>();

  onLikeToggled(event: { postId: number; likes: number[] }): void {
    const postIndex = this.posts.findIndex(p => p.id === event.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].likes = event.likes;
    }
  }

  onCommentsCountChanged(event: { postId: number; count: number }): void {
    const postIndex = this.posts.findIndex(p => p.id === event.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].commentsCount = event.count;
    }
  }

  onPostDeleted(postId: number): void {
    this.postDeleted.emit(postId);
  }
}
