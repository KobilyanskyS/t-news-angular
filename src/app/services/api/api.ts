// services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly API_SERVER: string = 'http://localhost:3000';
  private http = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.API_SERVER}/${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.API_SERVER}/${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.API_SERVER}/${url}`);
  }
}