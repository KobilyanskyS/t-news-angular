import { Component } from '@angular/core';
import { PostsListComponent } from '../../components/posts/posts-list/posts-list';

@Component({
  selector: 'app-feed-page',
  imports: [PostsListComponent],
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.less'
})
export class FeedPage {
  
}
