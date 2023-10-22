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

    public getDate24HoursLater(): Date {
        return new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    }
    public getDate2MonthsLater(): Date {
        let result: Date = new Date();
        result.setMonth(result.getMonth() + 2);
        return result;
    }
}