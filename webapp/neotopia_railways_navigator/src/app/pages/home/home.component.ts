import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { refreshAccessTokenData, rememberMeData } from 'src/app/models/user';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { TimetableService } from 'src/app/services/timetable.service';
import { UserService } from 'src/app/services/user.service';
import { MathService } from 'src/utils/common/shared/math.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public loggedUser: string | null = "";
  public lastScheduledDate: string = "";


  constructor(private router: Router, private userService: UserService, private timetableService: TimetableService,
    private jwtTokenService: JwtTokenService) { }

  ngOnInit() {
    this.loggedUser = sessionStorage.getItem('logged_user');
  }

  public onLogOut() {
    sessionStorage.removeItem('logged_user');
    this.jwtTokenService.logOut();

    this.router.navigate(['/login']);
  }

  public getLastTrainScheduleDate(): void {
    this.timetableService.getIfTrainsScheduled().subscribe({
      next: (res) => {
        console.log("it worked!");
        let lastDate: Date = res.LastDate;
        this.lastScheduledDate = lastDate.toString();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
