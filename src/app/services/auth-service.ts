import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Signup } from '../models/signup-model';
import { LoginModel } from '../models/login-model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;
  private logoutTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthenticatedSub() {
    return this.authenticatedSub.asObservable();
  }

  getToken() {
    return this.token;
  }

  signupUser(email: string, username: string, password: string) {
    const authData: Signup = {
      email: email,
      username: username,
      password: password,
    };
    this.http.post('http://localhost:3000/sign-up/', authData).subscribe(
      (res) => {
        this.router.navigate(['/login']);
        alert('Registration successful');
      },
      (error) => {
        console.error(error);
        alert('Error during registration');
      }
    );
  }

  loginUser(username: string, password: string) {
    const authData: LoginModel = { username: username, password: password };

    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/login/',
        authData
      )
      .subscribe(
        (res) => {
          console.log('Expires In:', res.expiresIn);
          this.token = res.token;
          if (this.token) {
            this.authenticatedSub.next(true);
            this.isAuthenticated = true;
            this.router.navigate(['/']);
            this.logoutTimer = setTimeout(() => {
              this.logout();
            }, res.expiresIn * 1000);
            const now = new Date();
            const expiresDate = new Date(now.getTime() + res.expiresIn * 1000);
            console.log('Expires In:', expiresDate);
            this.storeLoginDetails(this.token, expiresDate);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Invalid login. Please try again.');
        }
      );
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authenticatedSub.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.logoutTimer);
    this.clearLoginDetails();
    alert('Logged out.');
  }

  storeLoginDetails(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toISOString());
  }

  clearLoginDetails() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  getLocalStorageData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');

    if (!token || !expiresIn) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresIn),
    };
  }

  authenticateFromLocalStorage() {
    const localStorageData = this.getLocalStorageData();
    if (localStorageData) {
      const now = new Date();
      const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();
      console.log('Stored Expires In:', expiresIn);

      if (expiresIn > 0) {
        this.token = localStorageData.token;
        this.isAuthenticated = true;
        this.authenticatedSub.next(true);
        this.logoutTimer = setTimeout(() => this.logout(), expiresIn);
      }
    }
  }
}
