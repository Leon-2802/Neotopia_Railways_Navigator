import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rememberMeData, userdata } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MathService } from 'src/utils/common/shared/math.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public signupForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
    honeypot: new FormControl<string>('', Validators.maxLength(0))
  });
  public loginForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
    rememberMe: new FormControl<boolean>(false),
    honeypot: new FormControl<string>('', Validators.maxLength(0))
  });

  public feedbackmsglogin: string = "";
  public feedbackmsgsignup: string = "";
  public success: boolean = false;
  public selectedTab: number = 0;


  constructor(private userService: UserService, private router: Router, private mathService: MathService) { }

  ngOnInit() {
    if (localStorage.getItem('remembered_user')) {
      this.verifyRememberedUser();
    }
  }

  public onSignup(): void {
    if (this.signupForm.controls.honeypot.dirty) {
      this.feedbackmsgsignup = 'caught you, filthy bot!';
      this.success = false;
      return;
    }

    if (this.signupForm.controls.username.value && this.signupForm.controls.password.value) {
      let newUser: userdata = {
        username: this.signupForm.controls.username.value,
        password: this.signupForm.controls.password.value
      }

      this.userService.createUser(newUser).subscribe({
        next: (res) => {
          this.feedbackmsgsignup = res.body;
          this.success = true;
          this.selectedTab = 1;
        },
        error: (err) => {
          this.feedbackmsgsignup = err.error;
          this.success = false;
        }
      });
    }
  }

  public onLogin(): void {
    if (this.loginForm.controls.honeypot.dirty) {
      this.feedbackmsglogin = 'caught you, filthy bot!';
      this.success = false;
      return;
    }

    if (this.loginForm.controls.username.value && this.loginForm.controls.password.value
      && this.loginForm.controls.rememberMe.value != null) {
      let logindata: userdata = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      }
      let rememberMe: boolean = this.loginForm.controls.rememberMe.value;

      this.userService.compareUserData(logindata).subscribe({
        next: (res) => {
          this.feedbackmsglogin = res.body;
          this.success = true;
          this.forwardToApp(logindata.username, rememberMe);
        },
        error: (err) => {
          this.feedbackmsglogin = err.error;
          this.success = false;
        }
      });
    }
  }

  private forwardToApp(username: string, remember: boolean): void {
    if (remember) {
      this.rememberLogin(username); // navigation happens in rememberLogin function
    }
    else {
      sessionStorage.setItem('logged_user', username);
      this.router.navigate(['']);
    }
  }
  private rememberLogin(username: string): void {
    let verifyString: string = this.mathService.randomString(15);
    const rememberData: rememberMeData = {
      username: username,
      verifier: verifyString
    }

    this.userService.storeUserRemembered(rememberData).subscribe({
      next: (res) => {
        this.feedbackmsglogin = res.body;
        this.success = true;
        localStorage.setItem('remembered_user', JSON.stringify(rememberData));
        sessionStorage.setItem('logged_user', username);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.feedbackmsglogin = err.error;
        this.success = false;
      }
    });
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
              sessionStorage.setItem('logged_user', parsedData.username);
              this.router.navigate(['']);
            },
            error: (err) => {
              console.log(err);
            }
          });
        },
        error: (err) => {
          console.log(err);
        }
      });

    }
    else {
      console.log('no data in localstorage');
    }
  }

}
