import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserData } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private cookieService  = inject(CookieService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
    this.checkAuthStatus();
  }

  signUp(userData: UserData): Observable<User> {
    return this.api.post<User>('api/register', userData).pipe(
      tap(user => {
        this.setCurrentUser(user);
        console.log(user);
      })
    );
  }

  logIn(userData: UserData): Observable<User> {
    return this.api.post<User>('api/login', userData).pipe(
      tap(user => {
        this.setCurrentUser(user);
        console.log(user);
      })
    );
  }

    checkAuthStatus(): void {
    const userId = this.getUserIdFromCookies();
    if (userId) {
      const storedUser = this.getUserFromStorage();
      if (storedUser && storedUser.id === userId) {
        this.currentUserSubject.next(storedUser);
      } else {
        this.api.get<User>(`api/user/${userId}`).subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          }
        });
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: User): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  private getUserIdFromCookies(): number | null {
    const userId = this.cookieService.get('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  logOut(): Observable<{ success: boolean }> {
    return this.api.post<{ success: boolean }>('/api/logout', {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  clearAuthData(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.cookieService.delete('user_id');
  }

  isAuthenticated = (): boolean => {
    return this.currentUserSubject.value !== null;
  };

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

}
