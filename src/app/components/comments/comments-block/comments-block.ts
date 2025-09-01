import { Component, Input } from '@angular/core';
import { CommentComponent } from '../comment/comment';
import { CommentsFormComponent } from '../comments-form/comments-form';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-comments-block',
  imports: [CommentComponent, CommentsFormComponent],
  templateUrl: './comments-block.html',
  styleUrl: './comments-block.less'
})
export class CommentsBlockComponent {
  @Input()
  comments!: Comment[];
}
