import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  // NOTE: Check your Spring Boot backend to see what your actual login URL is!
  private apiUrl = 'http://localhost:8080/api/users'; 

  // Sends credentials to Spring Boot
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // When Spring Boot replies with a token, we save it to the browser!
        if (response && response.token) {
          localStorage.setItem('userToken', response.token);
          // Optional: Save user info too
          localStorage.setItem('username', response.username); 
        }
      })
    );
  }

  updateProfile(formData: FormData): Observable<any> {
    // We use your existing API base, likely http://localhost:8080/api/users
    return this.http.put(`${this.apiUrl}/profile`, formData, { responseType: 'text' });
  }

  register(userData: any): Observable<any> {
    // We add responseType: 'text' so Angular doesn't crash trying to parse a plain string
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}