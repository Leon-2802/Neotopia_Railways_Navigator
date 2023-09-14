import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userdata } from "../models/user";



@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient) { }

    public createUser(user: userdata) {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*'); // cors stuff nochmal durchlesen
        this.http.post(
            'http://localhost:8080/signup',
            user, { headers: headers, responseType: 'text' }).subscribe((res) => {
                console.log(res);
            });
    }

    public fetchUser() {
        // https://www.youtube.com/watch?v=9ZFXXMFSs8A&t=516s
        // min 6:00
    }

    public deleteUser() {

    }
}