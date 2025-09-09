import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search/search';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchResult } from '../../models/search-result';
import { PostsListComponent } from '../../components/posts/posts-list/posts-list';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, PostsListComponent, RouterModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.less'
})
export class SearchPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);

  searchResults: SearchResult = { users: [], posts: [] };
  isLoading = false;
  searchQuery = '';
  activeTab: 'posts' | 'users' = 'posts';

  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.queryParams
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(params => {
        this.searchQuery = params['q'] || '';
        this.activeTab = params['tab'] === 'users' ? 'users' : 'posts';
        
        if (this.searchQuery) {
          this.performSearch(this.searchQuery);
        } else {
          this.searchResults = { users: [], posts: [] };
        }
      });
  }

  performSearch(query: string): void {
    if (!query.trim()) return;

    this.isLoading = true;
    
    this.searchService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка при поиске:', error);
        this.isLoading = false;
        this.searchResults = { users: [], posts: [] };
      }
    });
  }

  setActiveTab(tab: 'posts' | 'users'): void {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}