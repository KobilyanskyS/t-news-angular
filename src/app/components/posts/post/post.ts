import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommentsBlockComponent } from '../../comments/comments-block/comments-block';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../../services/posts/posts';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-post',
  imports: [CommentsBlockComponent, RouterModule],
  templateUrl: './post.html',
  styleUrl: './post.less',
})
export class PostComponent {
  @Input() set post(value: any) {
    this._post = {
      ...value,
      likes: value?.likes || [],
      comments: value?.comments || [],
    };
    this.commentsCount = this._post.comments.length;
  }

  @Output() postDeleted = new EventEmitter<number>();
  @Output() likeToggled = new EventEmitter<{ postId: number; likes: number[] }>();
  @Output() commentsCountChanged = new EventEmitter<{ postId: number; count: number }>();


  get post(): any {
    return this._post;
  }


  // Внутреннее состояние
  private _post: any = { likes: [], comments: [] };
  showComments = false;
  isLiking = false;
  commentsCount = 0;
  isDeleting = false;


  // Сервисы / зависимости
  private postsService = inject(PostsService);
  private authService = inject(AuthService);


  // Сигналы и тексты
  showAuthWarning = signal(false);
  authWarningText = 'Чтобы ставить лайки, пожалуйста, войдите или зарегистрируйтесь.';


  // Переключение комментариев
  toggleComments() {
    this.showComments = !this.showComments;
  }


  // Логика лайков
  get isLiked(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.post.likes) return false;
    return this.post.likes.some((id: number) => id === currentUser.id);
  }

  onLikeClick(): void {
    const currentUser = this.authService.getCurrentUser();

    // Показать предупреждение если пользователь не авторизован
    if (!currentUser) {
      this.showTemporaryAuthWarning();
      return;
    }

    this.isLiking = true;

    this.postsService.toggleLike(this.post.id).subscribe({
      next: (response: any) => this.applyLikeResponse(response),
      error: (error: any) => {
        console.error('Ошибка при лайке: ', error);
        alert('Не удалось поставить лайк. Попробуйте позже');
      },
      complete: () => {
        this.isLiking = false;
      },
    });
  }

  private showTemporaryAuthWarning() {
    this.showAuthWarning.set(true);
    setTimeout(() => this.showAuthWarning.set(false), 3000);
  }

  private applyLikeResponse(response: any) {
    if (!response || !response.success) return;
    this.post.likes = response.likes;
    this.likeToggled.emit({ postId: this.post.id, likes: response.likes });
  }


  // Комментарии
  onCommentsChanged(): void {
    this.commentsCount = this.post.comments.length;
    this.commentsCountChanged.emit({ postId: this.post.id, count: this.commentsCount });
  }


  // Удаление поста
  get isAuthor(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.post.author_id;
  }

  onDeletePost(): void {
    if (this.isDeleting) return;

    this.isDeleting = true;

    this.postsService.deletePost(this.post.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.postDeleted.emit(this.post.id);
        }
      },
      error: (error: any) => {
        console.error('Ошибка при удалении поста:', error);
        this.isDeleting = false;
      },
    });
  }
}
