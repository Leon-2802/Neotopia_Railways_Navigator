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

  public loggedUser: string | null = "";
  public lastScheduledDate: string = "";


  constructor(private router: Router, private userService: UserService, private timetableService: TimetableService) { }

  ngOnInit() {
    this.loggedUser = sessionStorage.getItem('logged_user');
  }

  public onLogOut() {
    this.userService.logOut().subscribe({
      next: (res) => {
        console.log('logged out');
      },
      error: (err) => {
        console.error(err.message);
      }
    })

    this.router.navigate(['/login']);
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

  public updateLastScheduledDate(): void {
    this.timetableService.updateTrainsScheduled().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
