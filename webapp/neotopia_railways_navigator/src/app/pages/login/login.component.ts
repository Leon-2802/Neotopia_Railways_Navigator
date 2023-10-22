import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rememberMeData, userdata } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

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


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }

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

      this.userService.authenticateUser(logindata).subscribe({
        next: (res) => {
          let parsedRes = JSON.parse(res.body);
          this.success = true;
          this.feedbackmsglogin = parsedRes.message;

          this.forwardToApp(logindata.username, rememberMe);
        },
        error: (err) => {
          console.log(err);
          this.feedbackmsglogin = err.error;
          this.success = false;
        }
      });
    }
  }

  private forwardToApp(username: string, remember: boolean): void {
    sessionStorage.setItem('logged_user', username);
    this.router.navigate(['']);
  }
}
