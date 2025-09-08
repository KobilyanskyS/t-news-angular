import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommentComponent } from '../comment/comment';
import { CommentsFormComponent } from '../comments-form/comments-form';
import { Comment } from '../../../models/comment';
import { PostsService } from '../../../services/posts/posts';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-comments-block',
  imports: [CommentComponent, CommentsFormComponent],
  templateUrl: './comments-block.html',
  styleUrl: './comments-block.less'
})
export class CommentsBlockComponent {
  @Input() comments: Comment[] = [];
  @Input() postId!: number;
  @Output() commentsChanged = new EventEmitter<void>();
  
  private postsService = inject(PostsService);
  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  onCommentAdded(content: string): void {
    this.postsService.addComment(this.postId, content).subscribe({
      next: (response) => {
        if (response.success) {
          const newComment: Comment = {
            id: response.commentId,
            userId: this.currentUser!.id,
            content: content,
            author_name: this.currentUser!.name,
            author_avatar: this.currentUser!.avatar || '/Profile.svg'
          };
          
          this.comments = [...this.comments, newComment];
          this.commentsChanged.emit();
        }
      },
      error: (error) => {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий');
      }
    });
  }

  onCommentDeleted(commentId: number): void {
    this.postsService.deleteComment(commentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
          this.commentsChanged.emit();
        }
      },
      error: (error) => {
        console.error('Ошибка при удалении комментария:', error);
        alert('Не удалось удалить комментарий');
      }
    });
  }
}
