import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, filter, switchMap, take, takeUntil, throwError } from 'rxjs';
import { JwtTokenService } from '../services/jwt-token.service';
import { UserService } from '../services/user.service';


const TOKEN_HEADER_KEY = 'Authorization';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private jwtTokenService: JwtTokenService, private userService: UserService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let req: HttpRequest<any> = request;
    req = req.clone({
      withCredentials: true
    });

    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !req.url.includes('/signup') && !req.url.includes('/login') && error.status === 403) {
        return this.handle403Error(req, next);
      }
      else if (error instanceof HttpErrorResponse && !req.url.includes('/signup') && !req.url.includes('/login') && error.status === 401) {
        return this.handle401Error(req, next);
      }

      return throwError(() => new Error(error.error));
    }));
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.jwtTokenService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          console.log(res.message);

          return next.handle(this.resendRequest(request));
        }),
        catchError((err) => {
          this.isRefreshing = false;

          this.userService.logOut().subscribe({
            next: (res) => {
              console.log('logged out');
            },
            error: (err) => {
              console.error(err.message);
            }
          });

          this.router.navigate(['/login']);
          return throwError(() => new Error(err.message));
        })
      );
    }

    return this.refreshTokenSubject.pipe( //? what is this ?
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.resendRequest(request)))
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.userService.logOut().subscribe({
      next: (res) => {
        console.log('logged out');
      },
      error: (err) => {
        console.error(err.message);
      }
    });

    this.router.navigate(['/login']);
    return throwError(() => new Error('No jwt token present'));
  }

  private resendRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone();
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
