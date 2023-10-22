import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { refreshAccessTokenData } from '../models/user';
import { JwtTokenService } from '../services/jwt-token.service';


const TOKEN_HEADER_KEY = 'Authorization';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private jwtTokenService: JwtTokenService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let authReq: HttpRequest<any> = request;
    const token: string | null = this.jwtTokenService.getAccessToken();
    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('/signup') && !authReq.url.includes('/login') && error.status === 403) {
        return this.handle403Error(authReq, next);
      }
      else if (error instanceof HttpErrorResponse && !authReq.url.includes('/signup') && !authReq.url.includes('/login') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(() => new Error(error));
    }));
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token: string | null = this.jwtTokenService.getRefreshToken();
      const username: string | null = sessionStorage.getItem('logged_user')

      if (token && username) {
        const resfreshData: refreshAccessTokenData = {
          username: username,
          refreshToken: token
        }
        return this.jwtTokenService.refreshToken(resfreshData).pipe(
          switchMap((res) => {
            this.isRefreshing = false;
            console.log(res);

            this.jwtTokenService.storeAccessToken(res.body.accessToken);
            this.refreshTokenSubject.next(res.body.accessToken);

            return next.handle(this.addTokenHeader(request, res.body.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.jwtTokenService.logOut();
            this.router.navigate(['/login']);

            return throwError(() => new Error(err.message));
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe( //? what is this ?
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // kick user off current page to login-page, if no tokens are available
    const accessToken: string | null = this.jwtTokenService.getAccessToken();
    const refreshToken: string | null = this.jwtTokenService.getRefreshToken();

    if (accessToken == null || refreshToken == null) {
      this.jwtTokenService.logOut();
      this.router.navigate(['/login']);
    }

    return throwError(() => new Error('No jwt token present'));
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
