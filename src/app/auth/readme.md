## Auth module

- provides an auth guard that redirects to a login form.
- Credentials will be sent to a backend that validates the credentials and returns a JWT with a payload when valid:

```json
{
  iss: string; //issuer
  iat: number; //issued at (UNIX)
  exp: number; //expiration time (UNIX)
}
```

- if remember was ticked in the form the token will be written to local storage in order to automatically login on next page visit
