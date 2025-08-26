import { Component, Input } from '@angular/core';
import { Comment } from '../../../models/comment';
@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.html',
  styleUrl: './comment.less'
})
export class CommentComponent {
  @Input() comment!: Comment;
}
