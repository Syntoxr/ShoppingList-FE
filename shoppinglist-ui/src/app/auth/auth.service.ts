import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs';
import { handleError, validateToken } from './helpers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  requestedUrl: string;
  token: string = null;
  isAuthorized = false;

  private loginPath = '/api/login';

  constructor(private http: HttpClient, private router: Router) {}

  authenticate(username: string, password: string, remember: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      }),
    };

    this.http
      .get<{ token: string }>(this.loginPath, httpOptions)
      .pipe(retry(3), catchError(handleError))
      .subscribe({
        next: data => {
          this.token = data.token;
          if (remember) {
            this.storeToken(data.token);
          }
          this.onAuthSuccess();
        },
        error: error => {
          console.error(error);
        },
      });
  }

  autoLogin() {
    try {
      validateToken(this.readToken());
    } catch (error) {
      console.info(`autologin failed: ${error}`);
      return;
    }
    this.onAuthSuccess();
  }

  onAuthSuccess() {
    this.isAuthorized = true;
    console.log('Auth successful. Navigating to', this.requestedUrl ?? '/');
    this.router.navigate([this.requestedUrl ?? '/']);
  }

  // #region local storage operations

  storeToken(token: string) {
    localStorage.setItem('JWT', token);
  }

  readToken() {
    return localStorage.getItem('JWT');
  }

  deleteToken() {
    localStorage.removeItem('JWT');
  }

  // #endregion
}
