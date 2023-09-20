import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { userdata } from "../models/user";
import { ErrorHandlerService } from "./errorHandler.service";


@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient) { }

    public createUser(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8080/signup',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public compareUserData(user: userdata): Observable<any> {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        return this.http.post(
            'http://localhost:8080/login',
            user, { headers: headers, observe: 'response', responseType: 'text' });
    }

    public fetchUser() {
        // https://www.youtube.com/watch?v=9ZFXXMFSs8A&t=516s
        // min 6:00
    }

    public deleteUser() {

    }
}