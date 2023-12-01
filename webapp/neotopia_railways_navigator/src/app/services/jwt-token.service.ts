import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authUrl } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  private headers: HttpHeaders = new HttpHeaders().set('Access-Control-Allow-Origin', origin);

  constructor(private http: HttpClient) { }

  public async checkAccessToken(): Promise<boolean> {
    return this.http.post(
      authUrl + 'authorize', { headers: this.headers }).toPromise().then(
        data => {
          return true;
        }).catch(err => {
          console.error(err);
          return false;
        });
  }

  public refreshToken(): Observable<any> {
    return this.http.post(
      authUrl + 'token', { headers: this.headers, observe: 'response', responseType: 'json' });
  }
}
