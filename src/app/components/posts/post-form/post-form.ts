import { Component, EventEmitter, inject, Output } from '@angular/core';
import { PostsService } from '../../../services/posts/posts';
import { AuthService } from '../../../services/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-form',
  imports: [FormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.less'
})
export class PostFormComponent {
  @Output() postCreated = new EventEmitter<any>();
  
  private postsService = inject(PostsService);
  private authService = inject(AuthService);
  
  postContent = '';
  isSubmitting = false;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  onSubmit(): void {
    const content = this.postContent.trim();
    if (!content || this.isSubmitting || !this.isAuthenticated) return;

    this.isSubmitting = true;
    
    this.postsService.createPost(content).subscribe({
      next: (newPost) => {
        this.postCreated.emit(newPost);
        this.postContent = '';
      },
      error: (error) => {
        console.error('Ошибка при создании поста:', error);
        alert('Не удалось создать пост');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
