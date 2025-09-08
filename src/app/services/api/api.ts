// services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_SERVER: string = 'http://localhost:3000';
  private http = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.API_SERVER}/${url}`, {withCredentials: true});
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.API_SERVER}/${url}`, body, {withCredentials: true});
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.API_SERVER}/${url}`, body, {withCredentials: true});
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.API_SERVER}/${url}`, {withCredentials: true});
  }
}