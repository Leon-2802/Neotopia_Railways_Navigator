import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { rememberMeData } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MathService } from 'src/utils/common/shared/math.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public logged_user: string | null = "";

  constructor(private router: Router, private userService: UserService, private mathService: MathService) { }

  ngOnInit() {
    // check if user is already logged in
    // this.checkLoginSession();
    this.logged_user = sessionStorage.getItem('logged_user');
  }

  public onLogOut() {
    sessionStorage.removeItem('logged_user');

    let storedData: string | null = localStorage.getItem('remembered_user');
    if (storedData) {
      //remove rememberMe data from db and localstorage
      let parsedData: rememberMeData = JSON.parse(storedData);
      this.userService.deleteRememberedUserData(parsedData).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.removeItem('remembered_user');
        },
        error: (err) => {
          console.log(err);
          return;
        }
      });
    }

    this.router.navigate(['/login']);
  }
}
