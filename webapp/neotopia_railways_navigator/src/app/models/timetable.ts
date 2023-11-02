export class ScheduleDateDto {
    public date: string;

    constructor(date: string) {
        this.date = date;
    }
}

export interface TrainLine {
    startCity: string;
    firstTrain: string;
    middleStopCity: string;
    middleStopDuration: string;
    destinationCity: string;
    destinationDuration: string;
    period: string;
}