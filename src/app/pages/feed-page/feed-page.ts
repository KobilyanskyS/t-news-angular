import { Component } from '@angular/core';
import { PostsList } from '../../components/posts/posts-list/posts-list';

@Component({
  selector: 'app-feed-page',
  imports: [PostsList],
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.less'
})
export class FeedPage {
  
}
