import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { AuthService } from '../../services/auth/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
router = inject(Router);
  authService = inject(AuthService);
  
  currentPath$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => e.urlAfterRedirects || e.url)
  );

  isAuthPage$ = this.currentPath$.pipe(
    map(path => path === "/log-in" || path === "/sign-up")
  );
  
  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.currentUser$.pipe(map(user => user !== null));
  
  userId$ = this.currentUser$.pipe(map(user => user?.id?.toString() || ''));
  userName$ = this.currentUser$.pipe(map(user => user?.name || ''));
  userAvatar$ = this.currentUser$.pipe(map(user => user?.avatar || '/Profile.svg'));
}