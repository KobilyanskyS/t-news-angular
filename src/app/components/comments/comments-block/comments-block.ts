import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommentComponent } from '../comment/comment';
import { CommentsFormComponent } from '../comments-form/comments-form';
import { Comment } from '../../../models/comment';
import { PostsService } from '../../../services/posts/posts';
import { AuthService } from '../../../services/auth/auth';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-comments-block',
  imports: [CommentComponent, CommentsFormComponent],
  templateUrl: './comments-block.html',
  styleUrl: './comments-block.less'
})
export class CommentsBlockComponent {
  @Input() comments: Comment[] = [];
  @Input() postId!: Post['id'];
  @Output() commentsChanged = new EventEmitter<void>();


  private postsService = inject(PostsService);
  private authService = inject(AuthService);


  get currentUser() {
    return this.authService.getCurrentUser();
  }


  onCommentAdded(content: string): void {
    // Валидация на случай отсутствия пользователя или поста
    if (!this.currentUser) {
      alert('Требуется авторизация для добавления комментария');
      return;
    }
    if (!this.postId) return;

    this.addCommentToServer(content);
  }

  onCommentDeleted(commentId: number): void {
    // Делегируем удаление на сервис и обновляем локальный список
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


  // Вспомогательные приватные методы
  private addCommentToServer(content: string) {
    this.postsService.addComment(this.postId, content).subscribe({
      next: (response) => {
        if (!response.success) return;

        const newComment: Comment = this.buildCommentFromResponse(response.commentId, content);
        this.comments = [...this.comments, newComment];
        this.commentsChanged.emit();
      },
      error: (error) => {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий');
      }
    });
  }

  private buildCommentFromResponse(commentId: number, content: string): Comment {
    const user = this.currentUser!;
    return {
      id: commentId,
      userId: user.id,
      content,
      author_name: user.name,
      author_avatar: user.avatar || '/Profile.svg'
    } as Comment;
  }
}
