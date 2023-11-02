import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginDataDto, UserDataDto } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public signupForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    email: new FormControl<string>('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
    passwordConfirm: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
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
  public showSignupPwd: boolean = false;
  public showLoginPwd: boolean = false;


  constructor(private userService: UserService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }

  public onSignup(): void {
    if (this.signupForm.controls.honeypot.dirty) {
      this.feedbackmsgsignup = 'caught you, filthy bot!';
      this.success = false;
      return;
    }

    if (this.signupForm.controls.username.value && this.signupForm.controls.email.value && this.signupForm.controls.password.value) {

      //check if password repeat is valid:
      if (this.signupForm.controls.password.value !== this.signupForm.controls.passwordConfirm.value) {
        this.feedbackmsgsignup = 'Passwords do not match';
        this.success = false;
        return;
      }

      const newUser: UserDataDto = new UserDataDto(this.signupForm.controls.username.value,
        this.signupForm.controls.email.value, this.signupForm.controls.password.value);

      this.userService.createUser(newUser).subscribe({
        next: (res) => {
          this.feedbackmsgsignup = res.body;
          this.success = true;
          sessionStorage.setItem("pending_user", newUser.username);
          setTimeout(() => {
            this.router.navigate(['/verify-mail']);
          }, 200);
        },
        error: (err) => {
          if (err.message)
            this.feedbackmsgsignup = err.message;
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
      let logindata: LoginDataDto = new LoginDataDto(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value,
        this.loginForm.controls.rememberMe.value
      );

      this.userService.authenticateUser(logindata).subscribe({
        next: (res) => {
          let parsedRes = JSON.parse(res.body);
          this.success = true;
          this.feedbackmsglogin = parsedRes.message;

          this.forwardToApp(logindata.username);
        },
        error: (err) => {
          if (err.message)
            this.feedbackmsglogin = err.message;
          this.success = false;
        }
      });
    }
  }

  private forwardToApp(username: string): void {
    if (sessionStorage.getItem("pending_user")) {
      sessionStorage.removeItem("pending_user");
    }
    sessionStorage.setItem('logged_user', username);
    this.router.navigate(['']);
  }

  public togglePwdVisibility(signup: boolean): void {
    if (signup) {
      this.showSignupPwd = !this.showSignupPwd;
    }
    else {
      this.showLoginPwd = !this.showLoginPwd;
    }
  }
}
