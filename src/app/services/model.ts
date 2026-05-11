import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Model {
  private http = inject(HttpClient);
  
  // Cleaned this up to act as the base URL for all model requests
  private apiUrl = 'http://localhost:8080/api/models';

  // Fetch all for storefront
  getModels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/feed`);
  }

  // Fetch just ONE for the detail page
  getModelById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  uploadModel(formData: FormData): Observable<any> {
    // 1. Added /upload to the URL so it matches Spring Boot exactly
    // 2. Added responseType: 'text' so Angular doesn't crash when Spring Boot replies with a plain string
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  // --- CREATOR HUB SERVICES ---
  // Fetch models for the dashboard
  getMyModels(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/creator/${username}`);
  }

  // Delete a model from the database
  deleteModel(id: number): Observable<any> {
    // We use responseType: 'text' because Java returns a plain string on success
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getPublicProfile(username: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/users/public/${username}`);
  }
}