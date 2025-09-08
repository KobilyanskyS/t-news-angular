import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api = inject(ApiService);

  getUser(userId: User["id"]) {
    return this.api.get<User>(`api/user/${userId}`);
  }

  updateUserName(userId: User["id"], name: string) {
    return this.api.patch<User>('api/user/name', { name })
  }

  updateUserAbout(userId: User["id"], about: string) {
    return this.api.patch<User>('api/user/about', { about })
  }

  uploadAvatar(dataUrl: string): Observable<{ avatar: string }> {
    return this.api.post<{ avatar: string }>('api/user/avatar', { dataUrl });
  }

  subscribe(targetId: number): Observable<{ success: boolean; subscriptions: number[] }> {
    return this.api.post<{ success: boolean; subscriptions:  User['subscriptions'] }>(
      'api/subscribe', 
      { targetId, action: 'subscribe' }
    );
  }

  unsubscribe(targetId: number): Observable<{ success: boolean; subscriptions: number[] }> {
    return this.api.post<{ success: boolean; subscriptions: User['subscriptions'] }>(
      'api/subscribe', 
      { targetId, action: 'unsubscribe' }
    );
  }

}
