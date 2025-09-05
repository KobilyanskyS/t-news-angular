import { Component, inject, Input } from '@angular/core';
import { PostComponent } from '../post/post';
import { PostsService } from '../../../services/posts/posts';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-posts-list',
  imports: [PostComponent],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.less',
})
export class PostsListComponent {
  @Input() posts!: Post[];
}
