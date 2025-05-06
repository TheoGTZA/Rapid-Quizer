import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Question } from '../models/question';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api'; 

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

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getQuestionsByCategory(categoryId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions/category/${categoryId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
}