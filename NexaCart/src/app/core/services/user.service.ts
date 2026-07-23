import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`,
      { headers: this.authHeaders() });
  }

  update(userId: number, request: UpdateProfileRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, request,
      { headers: this.authHeaders() });
  }

  updatePassword(userId: number, request: UpdatePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/password`, request,
      { headers: this.authHeaders() });
  }
}
