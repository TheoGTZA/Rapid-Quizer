import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json' // Set responseType to 'text'
  };

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/login`, 
      { email, password },
      this.httpOptions
    ).pipe(
      tap((response: string) => {
        // Store the token in local storage
        localStorage.setItem('token', response);
      }
    ));
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Decoded token:', decodedPayload);
      return decodedPayload.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }


  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isContributor(): boolean {
    return this.getUserRole() === 'CONTRIBUTOR';
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
  
}