import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MathService {

    public randomString(length: number): string {
        let result: string = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    public formatDateToString(date: Date): string {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() + (offset * 60 * 1000));
        const year = date.toLocaleString("default", { year: "numeric" });
        const month = date.toLocaleString("default", { month: "2-digit" });
        const day = date.toLocaleString("default", { day: "2-digit" });
        const dateString: string = year + "-" + month + "-" + day;
        return dateString;
    }

    public sqlDatetimeToDate(datetime: string): Date {
        // datetime format = "yyyy-mm-ddThh:mm:ss.msZ"
        const sqlDateArray0: string[] = datetime.split("T");
        // sqlDateArray0 = ['yyyy-mm-dd' 'hh:mm:msZ']
        const sqlDateArray1: string[] = sqlDateArray0[0].split("-");
        // sqlDateArray1 = ['yyyy' 'mm' 'dd' 'hh:mm:msZ']
        const year: number = +sqlDateArray1[0];
        const month: number = (Number(+sqlDateArray1[1]) - 1);
        const day: number = +sqlDateArray1[2];
        const sqlDateArray2: string[] = sqlDateArray0[1].split(":");
        // format of sqlDateArray2[] = ['hh','mm','ss.msZ']
        const hour: number = +sqlDateArray2[0];
        const minute: number = +sqlDateArray2[1];
        const sqlDateArray3: string[] = sqlDateArray2[2].split(".");
        // format of sqlDateArray3[] = ['ss','msZ']
        const second: number = +sqlDateArray3[0];

        return new Date(year, month, day, hour, minute, second);
    }

    public getDate24HoursLater(): Date {
        return new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    }
    public getDate2MonthsLater(): Date {
        let result: Date = new Date();
        result.setMonth(result.getMonth() + 2);
        return result;
    }
}