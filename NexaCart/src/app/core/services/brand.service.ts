import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Brand {
  brandId: number;
  brandName: string;
  description?: string;
  brandLogo?: string;
  isActive: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'https://localhost:7053/api/Brand';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  getById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`);
  }

  create(brand: any): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, brand);
  }

  update(id: number, brand: any): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/${id}`, brand);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
