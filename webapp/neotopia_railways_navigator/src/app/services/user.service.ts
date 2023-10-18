import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError } from "rxjs";
import { refreshAccessTokenData, rememberMeData, userdata } from "../models/user";
import { JWTTokenService } from "./jwttoken.service";


@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient, private router: Router, private jwtTokenService: JWTTokenService) { }

    public createUser(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8080/signup',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public authenticateUser(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8081/login',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public fetchUser(username: string) {
        return this.http.get<{ user: userdata }>(
            `http://localhost:8080/users/${username}`, { responseType: 'json' });
    }

    public logOut(logOutData: refreshAccessTokenData) {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.post(
            'http://localhost:8081/logout',
            logOutData, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public deleteUser(username: string) {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
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