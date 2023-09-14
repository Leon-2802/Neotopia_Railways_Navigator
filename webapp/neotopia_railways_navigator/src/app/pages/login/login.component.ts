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

  userForm = new FormGroup({
    username: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    password: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)]))
  });

  constructor(private http: HttpClient, private userService: UserService) { }

  public onSignup() {
    if (this.userForm.controls.username.value && this.userForm.controls.password.value) {
      let newUser: userdata = {
        username: this.userForm.controls.username.value,
        password: this.userForm.controls.password.value
      }
      this.userService.createUser(newUser);
    }
  }

}
