import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, map, switchMap } from "rxjs";
import { MathService } from "src/utils/common/shared/math.service";
import { User } from "../models/user";
import { LoginDataDto, UserDataRequestDto, UserDataResponseDto, UsernameDto } from "../models/userDto";
import { JwtTokenService } from "./jwt-token.service";


@Injectable({ providedIn: "root" })
export class UserService {

    private headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');

    constructor(private http: HttpClient, private router: Router, private jwtTokenService: JwtTokenService, private mathService: MathService) { }


    public createUser(user: UserDataRequestDto): Observable<string | null> {
        return this.http.post(
            'http://localhost:8081/signup',
            user, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public resendConfirmationMail(username: UsernameDto): Observable<string | null> {
        return this.http.post(
            'http://localhost:8081/resend_confirmation_mail',
            username, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public authenticateUser(user: LoginDataDto): Observable<string | null> {
        return this.http.post(
            'http://localhost:8081/login',
            user, { headers: this.headers, observe: 'response', responseType: 'text' }).pipe(
                map((response => (response.body)))
            );
    }

    public fetchUser(username: string): Observable<User> {
        return this.http.get<UserDataResponseDto>(
            `http://localhost:8080/users/${username}`, { responseType: 'json' }).pipe(
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
            'http://localhost:8081/logout',
            { headers: this.headers, observe: 'response', responseType: 'json' })
    }

    public deleteUser(deleteData: UsernameDto): Observable<any> {
        return this.http.post(
            'http://localhost:8080/delete_user',
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