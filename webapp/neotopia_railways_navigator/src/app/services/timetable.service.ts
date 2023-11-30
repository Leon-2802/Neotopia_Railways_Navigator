import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MathService } from "src/utils/common/shared/math.service";
import { ScheduleDateDto } from "../models/timetable";
import { JwtTokenService } from "./jwt-token.service";

@Injectable({ providedIn: 'root' })
export class TimetableService {

    constructor(private http: HttpClient, private mathService: MathService) { }


    public getIfTrainsScheduled(): Observable<any> {
        const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' });
        return this.http.get(
            'http://localhost:8080/trains_scheduled', { headers: headers, responseType: 'json' });
    }

    public updateTrainsScheduled(): Observable<any> {
        const newDate: string = this.mathService.formatDateToString(new Date());
        const payload: ScheduleDateDto = new ScheduleDateDto(newDate);

        const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' });
        return this.http.post(
            'http://localhost:8080/set_trains_scheduled',
            payload, { headers: headers, responseType: 'text' });
    }
}