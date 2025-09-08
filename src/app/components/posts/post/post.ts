import { Component, Input } from '@angular/core';
import { CommentsBlockComponent } from '../../comments/comments-block/comments-block';
import { Post } from '../../../models/post';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [CommentsBlockComponent, RouterModule],
  templateUrl: './post.html',
  styleUrl: './post.less'
})
export class PostComponent {
  @Input() post!: Post;
  showComments: boolean = false;
  toggleComments() {
    this.showComments = !this.showComments;
  }
}
