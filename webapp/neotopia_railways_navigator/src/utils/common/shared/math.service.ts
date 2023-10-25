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

    public getDate24HoursLater(): Date {
        return new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    }
    public getDate2MonthsLater(): Date {
        let result: Date = new Date();
        result.setMonth(result.getMonth() + 2);
        return result;
    }
}