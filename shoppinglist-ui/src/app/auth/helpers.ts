import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

interface TokenPayload {
  iss: string; //issuer
  iat: number; //issued at (UNIX)
  exp: number; //expiration time (UNIX)
}

export function handleError(error: HttpErrorResponse) {
  if (error.message === 'INVALID_CREDENTIALS') {
    return throwError(() => new Error('Invalid credentials were entered'));
  }
  //Pass error
  return throwError(() => error);
}

export function validateToken(token: string) {
  if (!token) {
    throw new Error('got no token');
  }

  const decoded = decodeToken(token);

  if (decoded.iat + decoded.exp < Date.now()) {
    throw new Error('token is expired');
  }
}

function decodeToken(token: string) {
  try {
    const decoded = jwt_decode(token);
    if (!isTokenPayload(decoded)) {
      return null;
    }

    return decoded;
  } catch {
    throw new Error('could not decode token');
  }
}

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'iss' in payload &&
    'iat' in payload &&
    'exp' in payload
  );
}
