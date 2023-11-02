import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { TimetableService } from 'src/app/services/timetable.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public lastScheduledDate: string = "";
  public tripPlannerActive: boolean = false;
  public mapActive: boolean = false;
  public myTicketsActive: boolean = false;


  constructor(private timetableService: TimetableService, private router: Router) { }

  ngOnInit() {
    this.routeFeedback(this.router.url);
  }

  public navigateTo(path: string) {
    this.router.navigate([path]);

    this.tripPlannerActive = false;
    this.mapActive = false;
    this.myTicketsActive = false;

    this.routeFeedback(path);
  }

  public getLastTrainScheduleDate(): void {
    this.timetableService.getIfTrainsScheduled().subscribe({
      next: (res) => {
        let lastDate: Date = res.LastDate;
        this.lastScheduledDate = "Trains last scheduled at: " + lastDate.toString();
        // this.updateLastScheduledDate();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private updateLastScheduledDate(): void {
    this.timetableService.updateTrainsScheduled().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private routeFeedback(path: string): void {
    switch (path) {
      case '/trip-planner':
        this.tripPlannerActive = true;
        break;
      case '/map':
        this.mapActive = true;
        break;
      case '/my-tickets':
        this.myTicketsActive = true;
        break
    }
  }
}
