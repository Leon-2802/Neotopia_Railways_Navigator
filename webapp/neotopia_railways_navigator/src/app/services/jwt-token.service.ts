import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { MathService } from 'src/utils/common/shared/math.service';
import { refreshAccessTokenData } from '../models/user';

const ACCESSTOKEN_KEY = 'auth-access-token';
const REFRESHTOKEN_KEY: string = 'auth-refreshtoken';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private http: HttpClient, private cookieService: CookieService, private mathService: MathService) { }

  public storeAccessToken(accessToken: string) {
    this.cookieService.set(ACCESSTOKEN_KEY, accessToken, { secure: true });
    // window.sessionStorage.setItem(ACCESSTOKEN_KEY, accessToken);
  }
  public getAccessToken(): string | null {
    return this.cookieService.get(ACCESSTOKEN_KEY);
    // return window.sessionStorage.getItem(ACCESSTOKEN_KEY);
  }

  public storeRefreshToken(token: string, rememberUser: boolean) {
    if (rememberUser) {
      const expireDate = this.mathService.getDate2MonthsLater();
      this.cookieService.set(REFRESHTOKEN_KEY, token, { expires: expireDate, secure: true });
    } else {
      const expireDate = this.mathService.getDate24HoursLater();
      this.cookieService.set(REFRESHTOKEN_KEY, token, { expires: expireDate, secure: true });
    }
    // window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }
  public getRefreshToken(): string | null {
    return this.cookieService.get(REFRESHTOKEN_KEY);
    // return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public logOut(): void {
    this.cookieService.delete(ACCESSTOKEN_KEY);
    this.cookieService.delete(REFRESHTOKEN_KEY);
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.removeItem(ACCESSTOKEN_KEY);
  }

  public async checkAccessToken(): Promise<boolean> {
    const accessToken: string | null = this.getAccessToken();
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(
      'http://localhost:8081/authorize', { headers: headers }).toPromise().then(
        data => {
          return true;
        }).catch(err => {
          console.error(err);
          return false;
        });
  }

  public refreshToken(data: refreshAccessTokenData): Observable<any> {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    return this.http.post(
      'http://localhost:8081/token',
      data, { headers: headers, observe: 'response', responseType: 'json' });
  }
}
