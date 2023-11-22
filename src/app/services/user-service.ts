import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }

  getUserProfile(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user-profile/${username}`).pipe(
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        alert('User not found');
        this.router.navigate(['/']);
        return throwError(error);
      })
    );
  }
}
