import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError, of } from 'rxjs';
import { Question } from '../models/question';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api';
  private qPublic: Observable<Question[]>;
  private qPersonal: Observable<Question[]>;

  constructor(private http: HttpClient,) {}


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Backend connection error:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Server unreachable. Please verify the backend is running.'));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getQuestionsPublic(): Observable<Question[]> {
    this.qPublic = this.http.get<Question[]>(`${this.apiUrl}/questions/public`).pipe(
      retry(3),
      catchError(this.handleError)
    );
    return this.qPublic;
  }

  getQuestionsPersonal(): Observable<Question[]> {
    const token = localStorage.getItem('token');
    if (token != null) {
      const parsed = JSON.parse(token);
      const id = parsed.userId;
      this.qPersonal = this.http.get<Question[]>(`${this.apiUrl}/questions/personal/${id}`).pipe(
        retry(3),
        catchError(this.handleError)
      );
      return this.qPersonal;
    }
    this.qPersonal = of([]);
    return this.qPersonal;
  }

  getQuestionsByCategoryPublic(categoryId: number): Observable<Question[]> {
    this.qPublic = this.http.get<Question[]>(`${this.apiUrl}/questions/category/${categoryId}/public`).pipe(
      retry(3),
      catchError(this.handleError)
    );
    return this.qPublic;
  }

  getQuestionsByCategoryPersonal(categoryId: number): Observable<Question[]> {
    const token = localStorage.getItem('token');
    if (token != null) {
      const parsed = JSON.parse(token);
      const id = parsed.userId;
      this.qPersonal = this.http.get<Question[]>(`${this.apiUrl}/questions/category/${categoryId}/personal/${id}`).pipe(
        retry(3),
        catchError(this.handleError)
      );
      return this.qPersonal;
    }
    this.qPersonal = of([]);
    return this.qPersonal;
  }
}
