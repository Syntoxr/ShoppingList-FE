import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, retry } from 'rxjs';
import { SocketService } from '../shared/socket.service';
import { loadItems } from '../shopping-list/store/shopping-list.actions';
import { handleError, validateToken } from './helpers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  requestedUrl: string;
  token: string = null;
  isAuthorized = false;

  private loginPath = '/api/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store,
    private socketService: SocketService
  ) {}

  authenticate(username: string, password: string, remember: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      }),
    };

    this.http
      .get<{ token: string }>(this.loginPath, httpOptions)
      .pipe(catchError(handleError))
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

  logout() {
    this.token = null;
    this.isAuthorized = false;
    this.deleteToken();
    this.router.navigate(['/auth']);
  }

  autoLogin() {
    try {
      const storedToken = this.readToken();
      validateToken(storedToken);
      this.token = storedToken;
    } catch (error) {
      console.info(`autologin failed: ${error}`);
      return;
    }
    this.onAuthSuccess();
  }

  onAuthSuccess() {
    this.isAuthorized = true;
    this.socketService.connect(this.token);
    this.store.dispatch(loadItems());
    console.log('Auth successful. Navigating to', this.requestedUrl ?? '/');
    this.router.navigate([this.requestedUrl ?? '/']);
  }

  // #region local storage operations

  protected storeToken(token: string) {
    localStorage.setItem('JWT', token);
  }

  protected readToken() {
    return localStorage.getItem('JWT');
  }

  protected deleteToken() {
    localStorage.removeItem('JWT');
  }

  // #endregion
}
