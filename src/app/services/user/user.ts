import { inject, Injectable } from '@angular/core';
import { Api } from '../api/api';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private api = inject(Api);

  getAllPosts(): Observable<User[]> {
      return this.api.get<User[]>('users.json');
  }
}
