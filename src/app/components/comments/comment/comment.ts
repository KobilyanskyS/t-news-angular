import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Comment } from '../../../models/comment';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-comment',
  imports: [RouterModule],
  templateUrl: './comment.html',
  styleUrl: './comment.less'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() commentDeleted = new EventEmitter<number>();


  private authService = inject(AuthService);


  isDeleting = false;


  get isAuthor(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!(currentUser && currentUser.id === this.comment.userId);
  }


  onDelete(): void {
    if (this.isDeleting) return;

    this.isDeleting = true;
    this.commentDeleted.emit(this.comment.id);
  }
}
