import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, of, throwError } from 'rxjs';
import { SocketService } from '../shared/socket.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthMockService extends AuthService {
  private mockUsername = 'user';
  private mockPassword = 'notSave';

  // set to this.mockToken in order to automatically login
  private localMockToken = null;
  private delay = 500;

  constructor(router: Router, store: Store, socketService: SocketService) {
    super(null, router, store, socketService);
  }

  override authenticate(username: string, password: string, remember: boolean) {
    console.info('%c Auth [GET] request would be sent', 'color: green');
    this.getMockResponse(username, password).subscribe({
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

  private getMockResponse(username: string, password: string) {
    if (username === this.mockUsername && password === this.mockPassword) {
      return of({ token: this.mockToken }).pipe(delay(this.delay));
    } else {
      const error = new Error(
        JSON.stringify({ message: 'could not authorize', code: 500 })
      );
      return throwError(() => error).pipe(delay(this.delay));
    }
  }

  /**
   * build 10 minute mock token
   * the signature of the token is not valid, but the payload will be, which is sufficient for mock purposes
   **/
  private get mockToken() {
    const payload = btoa(
      `{"iss": "user", "exp": ${
        Date.now() / 1000 + 600
      }, "iat": ${Date.now()} }`
    );
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.Mc3CM9MrTNPSX1b9sZFrEPGKdnYVVp-RjdiZd_2_J2w`;
  }
}
