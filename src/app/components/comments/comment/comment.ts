import { Component, Input } from '@angular/core';
import { Comment } from '../../../models/comment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment',
  imports: [RouterModule],
  templateUrl: './comment.html',
  styleUrl: './comment.less'
})
export class CommentComponent {
  @Input() comment!: Comment;
}
