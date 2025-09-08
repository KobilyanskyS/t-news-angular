import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-form',
  imports: [FormsModule],
  templateUrl: './comments-form.html',
  styleUrl: './comments-form.less'
})
export class CommentsFormComponent {
  @Output() commentAdded = new EventEmitter<string>();

  private authService = inject(AuthService);

  commentContent = '';
  isSubmitting = false;
  
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  onSubmit(): void {
    const content = this.commentContent.trim();
    if (!content || this.isSubmitting) return;

    this.isSubmitting = true;
    this.commentAdded.emit(content);
    this.commentContent = '';
    this.isSubmitting = false;
  }
}
