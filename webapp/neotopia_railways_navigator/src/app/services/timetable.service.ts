import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JWTTokenService } from "./jwttoken.service";

@Injectable({ providedIn: 'root' })
export class TimetableService {

    constructor(private http: HttpClient, private jwtTokenService: JWTTokenService) { }


    public getIfTrainsScheduled(): Observable<any> {
        const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
        return this.http.get(
            'http://localhost:8080/trains_scheduled', { headers: headers, responseType: 'json' });
    }
}