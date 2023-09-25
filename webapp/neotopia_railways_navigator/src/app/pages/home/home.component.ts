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
    this.checkLoginSession();
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

  private checkLoginSession() {
    let logged_username = sessionStorage.getItem('logged_user');
    if (logged_username) {
      this.userService.fetchUser(logged_username).subscribe({
        next: (res) => {
          console.log(res);
          this.logged_user = logged_username;
        },
        error: (err) => { console.log(err); }
      });
    }
    else {
      if (localStorage.getItem('remembered_user')) {
        this.verifyRememberedUser();
      }
      else {
        this.router.navigate(['/login']);
      }
    }
  }

  private verifyRememberedUser() {
    let storedData: string | null = localStorage.getItem('remembered_user');
    if (storedData) {
      let parsedData: rememberMeData = JSON.parse(storedData);
      console.log(parsedData);

      this.userService.verifyRememberedUser(parsedData).subscribe({
        next: (res) => {
          console.log(res);

          let verifyString: string = this.mathService.randomString(15);
          const newRememberData: rememberMeData = {
            username: parsedData.username,
            verifier: verifyString
          }

          this.userService.updateRememberedUser(newRememberData).subscribe({
            next: (res) => {
              console.log(res);
              localStorage.setItem('remembered_user', JSON.stringify(newRememberData));
              this.logged_user = parsedData.username;
              sessionStorage.setItem('logged_user', parsedData.username);
            },
            error: (err) => {
              console.log(err);
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['/login']);
        }
      });

    }
    else {
      console.log('no data in localstorage');
      this.router.navigate(['/login']);
    }
  }

}
