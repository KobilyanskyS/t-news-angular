import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api = inject(ApiService);

  getAllPosts(): Observable<User[]> {
      return this.api.get<User[]>('users.json');
  }
}
