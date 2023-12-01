import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, map, switchMap } from "rxjs";
import { authUrl, origin, url } from "src/environment";
import { MathService } from "src/utils/common/shared/math.service";
import { User } from "../models/user";
import { LoginDataDto, UserDataRequestDto, UserDataResponseDto, UsernameDto } from "../models/userDto";
import { JwtTokenService } from "./jwt-token.service";


@Injectable({ providedIn: "root" })
export class UserService {

    private headers: HttpHeaders = new HttpHeaders().set('Access-Control-Allow-Origin', origin);

    constructor(private http: HttpClient, private router: Router, private jwtTokenService: JwtTokenService, private mathService: MathService) { }


    public createUser(user: UserDataRequestDto): Observable<string | null> {
        return this.http.post(
            authUrl + 'signup',
            user, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public resendConfirmationMail(username: UsernameDto): Observable<string | null> {
        return this.http.post(
            authUrl + 'resend_confirmation_mail',
            username, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public authenticateUser(user: LoginDataDto): Observable<string | null> {
        return this.http.post(
            authUrl + 'login',
            user, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public fetchUser(username: string): Observable<User> {
        return this.http.get<UserDataResponseDto>(
            url + `users/${username}`, { responseType: 'json' }).pipe(
                map(user => ({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    confirmed: Boolean(user.confirmed),
                    createdAt: this.mathService.sqlDatetimeToDate(user.createdAt)
                }))
            );
    }

    public logOut(): Observable<any> {
        localStorage.removeItem('logged_user');
        return this.http.post(
            authUrl + 'logout',
            { headers: this.headers, observe: 'response', responseType: 'json' })
    }

    public deleteUser(deleteData: UsernameDto): Observable<any> {
        return this.http.post(
            url + 'delete_user',
            deleteData, { headers: this.headers, observe: 'response', responseType: 'json' });
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