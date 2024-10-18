import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isLoggedIn: boolean = false;

  login(userDetails: { email: string; password: string }): Observable<any> {
    console.log(userDetails);
    return this.http.post<any>('http://localhost:3000/auth/login', userDetails)
      // .pipe(map(response => {
      //     if (response.access_token) {
      //       localStorage.setItem('JWT_Token', response.access_token);
      //       this.isLoggedIn = true;
      //       return true;
      //     }
      //     console.log(response.message);
      //     return false;
      //   }),
      //   catchError(error => {
      //     console.log(error);
      //     this.isLoggedIn = false;
      //     return of(false);
      //   })
      // );
  }

  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  getToken(): string | null {
    return localStorage.getItem('JWT_Token');
  }
  logout(): void {
    localStorage.removeItem('JWT_Token');
    this.isLoggedIn = false;
    window.location.reload()
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('JWT_Token');
    if (token) {
      this.isLoggedIn = true;
      return true;
    }
    this.isLoggedIn = false;
    return false;
  }
  getProfile():any{
    return this.http.get<any>('http://localhost:3000/auth/profile')
  }
}
