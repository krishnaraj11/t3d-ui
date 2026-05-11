import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Look inside the browser's memory for the login token
  const token = localStorage.getItem('token');

  // 2. If a token exists, clone the request and staple the token to the Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Send the securely modified request to Spring Boot
    return next(clonedRequest);
  }

  // 3. If no token (like when registering or logging in), just send it normally
  return next(req);
};