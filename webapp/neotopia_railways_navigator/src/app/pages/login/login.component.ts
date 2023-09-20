import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { userdata } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public signupForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)]))
  });
  public loginForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
    rememberMe: new FormControl<boolean>(false)
  });

  public feedbackmsg: any = "";
  public success: boolean = false;


  constructor(private http: HttpClient, private userService: UserService) { }

  public onSignup(): void {
    if (this.signupForm.controls.username.value && this.signupForm.controls.password.value) {
      let newUser: userdata = {
        username: this.signupForm.controls.username.value,
        password: this.signupForm.controls.password.value
      }

      this.userService.createUser(newUser).subscribe(success => {
        this.feedbackmsg = success.body;
        this.success = true;
        this.forwardToLogin();
      }, error => { // second parameter is to listen for error
        this.feedbackmsg = error.error;
        this.success = false;
      });;
    }
  }

  public onLogin(): void {
    if (this.loginForm.controls.username.value && this.loginForm.controls.password.value
      && this.loginForm.controls.rememberMe.value != null) {
      let logindata: userdata = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      }
      let rememberMe: boolean = this.loginForm.controls.rememberMe.value;

      // this.userService.compareUserData(logindata).subscribe(success => {
      //   this.feedbackmsg = success.body;
      //   this.success = true;
      //   this.forwardToApp(rememberMe);
      // }, error => { // second parameter is to listen for error
      //   this.feedbackmsg = error.error;
      //   this.success = false;
      // });;

      this.userService.compareUserData(logindata).subscribe({
        next: (value) => {
          this.feedbackmsg = value;
          this.success = true;
          this.forwardToApp(rememberMe);
        },
        error: (err) => {
          this.feedbackmsg = err.error;
          this.success = false;
        }
      });
    }
  }

  private forwardToLogin(): void {
  }

  private forwardToApp(remember: boolean): void {
    if (remember) {
      this.rememberLogin();
    }
    // navigate to home page
  }
  private rememberLogin(): void {
    // save in cookies that user is logged in => https://stackoverflow.com/questions/6340562/storing-login-information-in-cookies

  }

}
