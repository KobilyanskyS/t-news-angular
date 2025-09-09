import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchResult } from '../../models/search-result';
import { HttpClient } from '@angular/common/http';
import { API_SERVER } from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  search(query: string): Observable<SearchResult> {
    return this.http
      .get<SearchResult>(`${API_SERVER}/api/search`, {
        params: { q: query },
      })
      .pipe(
        map((results) => {
          return this.enrichPostsWithCommentAuthors(results);
        })
      );
  }

  private enrichPostsWithCommentAuthors(results: SearchResult): SearchResult {
    const enrichedPosts = results.posts.map((post) => {
      if (post.comments && post.comments.length > 0) {
        const enrichedComments = post.comments.map((comment) => {
          if (comment.author_name && comment.author_avatar) {
            return comment;
          }
          return {
            ...comment,
            author_name: comment.author_name || 'Пользователь',
            author_avatar: comment.author_avatar || '/Profile.svg',
          };
        });
        return {
          ...post,
          comments: enrichedComments,
        };
      }
      return post;
    });
    return {
      ...results,
      posts: enrichedPosts,
    };
  }
}
