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


  constructor(private userService: UserService, private router: Router, private mathService: MathService) { }

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
          this.forwardToLogin();
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

  private forwardToLogin(): void {
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
    // eventuell entfernen, sobald man nur noch nach log-out auf login-path zugreifen kann--------------------------------
    let check_data: string | null = localStorage.getItem('remembered_user');
    if (check_data) {
      let remeberedUser: rememberMeData = JSON.parse(check_data);
      if (remeberedUser.username === username) {
        // verifiy user...
        sessionStorage.setItem('logged_user', username);
        this.router.navigate(['']);
        return;
      }
    }
    //--------------------------------------------------------------------------------------------------------------------

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

}
