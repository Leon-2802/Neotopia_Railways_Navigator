import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { url } from "src/environment";
import { MathService } from "src/utils/common/shared/math.service";
import { ScheduleDateDto } from "../models/timetable";

@Injectable({ providedIn: 'root' })
export class TimetableService {

    private headers: HttpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': origin });

    constructor(private http: HttpClient, private mathService: MathService) { }


    public getIfTrainsScheduled(): Observable<any> {
        return this.http.get(
            url + 'trains_scheduled', { headers: this.headers, responseType: 'json' });
    }

    public updateTrainsScheduled(): Observable<any> {
        const newDate: string = this.mathService.formatDateToString(new Date());
        const payload: ScheduleDateDto = new ScheduleDateDto(newDate);

        return this.http.post(
            url + 'set_trains_scheduled',
            payload, { headers: this.headers, responseType: 'text' });
    }
}