import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError } from "rxjs";
import { rememberMeData, userdata } from "../models/user";


@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient, private router: Router) { }

    public createUser(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8080/signup',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public compareUserData(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8081/login',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public storeUserRemembered(rememberUser: rememberMeData): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.post(
            'http://localhost:8080/store_remember_user',
            rememberUser, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public verifyRememberedUser(rememberedUser: rememberMeData): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.post(
            'http://localhost:8080/check_remember_user',
            rememberedUser, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public updateRememberedUser(rememberedUser: rememberMeData): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.post(
            'http://localhost:8080/update_remember_user',
            rememberedUser, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public deleteRememberedUserData(rememberedUser: rememberMeData): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.post(
            'http://localhost:8080/delete_remember_user',
            rememberedUser, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public fetchUser(username: string) {
        return this.http.get<{ user: userdata }>(
            `http://localhost:8080/users/${username}`, { responseType: 'json' });
    }


    public deleteUser() {

    }

    // ! super insecure! Add jwt authentication to it
    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //your logic goes here
        if (sessionStorage.getItem('logged_user'))  // async request with JWT auth
            return true;

        this.router.navigate(['/login']);
        return false;
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(UserService).canActivate(next, state);
}