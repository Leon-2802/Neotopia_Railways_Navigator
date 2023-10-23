import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { loginData, userdata } from "../models/user";
import { JwtTokenService } from "./jwt-token.service";


@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient, private router: Router, private jwtTokenService: JwtTokenService) { }

    public createUser(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8080/signup',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public authenticateUser(user: loginData): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8081/login',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public fetchUser(username: string) {
        return this.http.get<{ user: userdata }>(
            `http://localhost:8080/users/${username}`, { responseType: 'json' });
    }

    public logOut() {
        sessionStorage.removeItem('logged_user');
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8081/logout',
            { headers: headers, observe: 'response', responseType: 'json' });
    }

    public deleteUser(username: string) {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8080/delete_user',
            username, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const response = await this.jwtTokenService.checkAccessToken();
        if (response == true) {
            console.log('user is authorized');
            return true;
        } else {
            console.error('user is not authorized, login first');
            await this.router.navigate(['/login']);
            return false;
        }
    }

}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    return inject(UserService).canActivate(next, state);
}