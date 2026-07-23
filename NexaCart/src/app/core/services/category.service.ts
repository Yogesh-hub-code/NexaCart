import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/Category`;

  constructor(
    private http: HttpClient
  ) {}


  getAll(): Observable<Category[]> {
    debugger;
    return this.http.get<Category[]>(this.apiUrl);
  }


  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }


  create(category: any): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      category
    );
  }


  update(id: number, category: any): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`,
      category
    );
  }


  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}