// services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SERVER } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${API_SERVER}/${url}`, {withCredentials: true});
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_SERVER}/${url}`, body, {withCredentials: true});
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${API_SERVER}/${url}`, body, {withCredentials: true});
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${API_SERVER}/${url}`, {withCredentials: true});
  }
}