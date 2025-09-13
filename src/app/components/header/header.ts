import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import {
  filter,
  map,
  debounceTime,
} from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Subject, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);


  searchQuery = signal<string>('');


  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];


  currentPath$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e) => e.urlAfterRedirects || e.url)
  );

  isAuthPage$ = this.currentPath$.pipe(
    map((path) => path === '/log-in' || path === '/sign-up')
  );

  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));
  userId$ = this.currentUser$.pipe(map((user) => user?.id?.toString() || ''));
  userName$ = this.currentUser$.pipe(map((user) => user?.name || ''));
  userAvatar$ = this.currentUser$.pipe(
    map((user) => user?.avatar || '/Profile.svg')
  );

  constructor() {
    this.initSubscriptions();
  }

  private initSubscriptions(): void {
    const routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;
        if (!url.startsWith('/search')) {
          this.searchQuery.set('');
        }
      });

    const searchSub = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((query) => this.performSearch(query));

    this.subscriptions.push(routeSub, searchSub);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery();
    if (query) {
      this.performSearch(query);
    }
  }

  private performSearch(query: string): void {
    this.router.navigate(['/search'], {
      queryParams: { q: query },
      queryParamsHandling: 'merge',
    });
  }

  logout(): void {
    this.authService.logOut().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.authService.clearAuthData();
        this.router.navigate(['/']);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.searchSubject.complete();
  }
}
