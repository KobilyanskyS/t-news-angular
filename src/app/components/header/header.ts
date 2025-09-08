import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from "rxjs/operators";
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  
  currentPath = signal<string>(this.router.url);
  isAuthenticated = this.authService.isAuthenticated;
  userId= this.authService.getUserFromStorage()?.id as unknown as string;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentPath.set(e.urlAfterRedirects || e.url);
      });
  }

  isAuthPage(): boolean {
    return this.currentPath() === "/log-in" || this.currentPath() === "/sign-up";
  }
}