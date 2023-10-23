import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private http: HttpClient) { }

  public async checkAccessToken(): Promise<boolean> {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
    return this.http.post(
      'http://localhost:8081/authorize', { headers: headers }).toPromise().then(
        data => {
          return true;
        }).catch(err => {
          console.error(err);
          return false;
        });
  }

  public refreshToken(): Observable<any> {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
    return this.http.post(
      'http://localhost:8081/token', { headers: headers, observe: 'response', responseType: 'json' });
  }
}
