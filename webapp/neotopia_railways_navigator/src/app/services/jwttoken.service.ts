import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { refreshAccessTokenData } from '../models/user';

const ACCESSTOKEN_KEY = 'auth-access-token';
const REFRESHTOKEN_KEY: string = 'auth-refreshtoken';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

  constructor(private http: HttpClient) { }

  public storeAccessToken(accessToken: string) {
    window.sessionStorage.setItem(ACCESSTOKEN_KEY, accessToken);
  }
  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(ACCESSTOKEN_KEY);
  }

  public storeRefreshToken(token: string) {
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }
  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public logOut(): void {
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
