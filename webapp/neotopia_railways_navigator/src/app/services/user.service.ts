import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LoginDataDto, UserDataDto, UsernameDto } from "../models/user";
import { JwtTokenService } from "./jwt-token.service";


@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient, private router: Router, private jwtTokenService: JwtTokenService) { }

    public createUser(user: UserDataDto): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8081/signup',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public authenticateUser(user: LoginDataDto): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8081/login',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public fetchUser(username: string): Observable<any> {
        return this.http.get<{ user: UserDataDto }>(
            `http://localhost:8080/users/${username}`, { responseType: 'json' });
    }

    public logOut(): Observable<any> {
        sessionStorage.removeItem('logged_user');
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8081/logout',
            { headers: headers, observe: 'response', responseType: 'json' });
    }

    public deleteUser(deleteData: UsernameDto): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(
            'http://localhost:8080/delete_user',
            deleteData, { headers: headers, observe: 'response', responseType: 'json' });
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