import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommentsBlockComponent } from '../../comments/comments-block/comments-block';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../../services/posts/posts';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-post',
  imports: [CommentsBlockComponent, RouterModule],
  templateUrl: './post.html',
  styleUrl: './post.less'
})
export class PostComponent {
  @Input() set post(value: any) {
    this._post = {
      ...value,
      likes: value?.likes || [],
      comments: value?.comments || []
    };
    this.commentsCount = this._post.comments.length;
  }

  @Output() postDeleted = new EventEmitter<number>();
  
  get post(): any {
    return this._post;
  }
  
  private _post: any = {
    likes: [],
    comments: []
  };
  
  @Output() likeToggled = new EventEmitter<{ postId: number; likes: number[] }>();
  @Output() commentsCountChanged = new EventEmitter<{ postId: number; count: number }>();
  
  showComments = false;
  isLiking = false;
  commentsCount = 0;
  isDeleting = false;

  postsService = inject(PostsService);
  authService = inject(AuthService);

  toggleComments() {
    this.showComments = !this.showComments;
  }

  get isLiked(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.post.likes) return false;

    return this.post.likes.some((id: number) => id === currentUser.id);
  }

  onLikeClick(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser){
      alert('Чтобы ставить лайки, пожалуйста, войдите или зарегистрируйтесь.');
      return;
    }

    this.isLiking = true;

    this.postsService.toggleLike(this.post.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.post.likes = response.likes;

          this.likeToggled.emit({
            postId: this.post.id,
            likes: response.likes
          });
        }
      },
      error: (error) => {
        console.error('Ошибка при лайке: ', error);
        alert('Не удалось поставить лайк. Попробуйте позже');
      },
      complete: () => {
        this.isLiking = false;
      }
    })
  }

  onCommentsChanged(): void {
    this.commentsCount = this.post.comments.length;

    this.commentsCountChanged.emit({
      postId: this.post.id,
      count: this.commentsCount
    });
  }

  get isAuthor(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.post.author_id;
  }

  onDeletePost(): void {
    if (this.isDeleting) return;
    
    this.isDeleting = true;
    
    this.postsService.deletePost(this.post.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.postDeleted.emit(this.post.id);
        }
      },
      error: (error) => {
        console.error('Ошибка при удалении поста:', error);
        this.isDeleting = false;
      }
    });
  }
}
