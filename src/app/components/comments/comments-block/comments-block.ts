import { Component, Input } from '@angular/core';
import { CommentComponent } from '../comment/comment';
import { CommentsForm } from '../comments-form/comments-form';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-comments-block',
  imports: [CommentComponent, CommentsForm],
  templateUrl: './comments-block.html',
  styleUrl: './comments-block.less'
})
export class CommentsBlock {
  @Input()
  comments!: Comment[];
}
