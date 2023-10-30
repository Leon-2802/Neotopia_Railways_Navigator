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

    public formatDate(date: Date): string {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() + (offset * 60 * 1000));
        const year = date.toLocaleString("default", { year: "numeric" });
        const month = date.toLocaleString("default", { month: "2-digit" });
        const day = date.toLocaleString("default", { day: "2-digit" });
        const dateString: string = year + "-" + month + "-" + day;
        return dateString;
    }

    public sqlDatetimeToDate(datetime: string): Date {
        // datetime format = "yyyy-mm-dd hh:mm:ss.ms"
        const sqlDateArray0: string[] = datetime.split("-");
        // sqlDateArray0 = ['yyyy','mm','dd hh:mm:ms']
        const year: number = +sqlDateArray0[0];
        const month: number = (Number(+sqlDateArray0[1]) - 1);
        const sqlDateArray1: string[] = sqlDateArray0[2].split(" ");
        // sqlDateArray1 = ['dd', 'hh:mm:ss.ms']
        const day: number = +sqlDateArray1[0];
        const sqlDateArray2: string[] = sqlDateArray1[1].split(":");
        // format of sqlDateArray2[] = ['hh','mm','ss.ms']
        const hour: number = +sqlDateArray2[0];
        const minute: number = +sqlDateArray2[1];
        const sqlDateArray3: string[] = sqlDateArray2[1].split(".");
        // format of sqlDateArray3[] = ['ss','ms']
        const second: number = +sqlDateArray3[0];
        const millisecond: number = +sqlDateArray3[1];

        return new Date(year, month, day, hour, minute, second, millisecond);
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