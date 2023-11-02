import { Component } from '@angular/core';
import { UsernameDto } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-mail',
  templateUrl: './verify-mail.component.html',
  styleUrls: ['./verify-mail.component.scss']
})
export class VerifyMailComponent {

  public feedbackMsg: string = "";
  public success: boolean = false;

  constructor(private userService: UserService) { }

  public onResendMail(): void {
    const username: string | null = sessionStorage.getItem('pending_user');
    if (username) {
      const usernameData: UsernameDto = new UsernameDto(username);
      this.userService.resendConfirmationMail(usernameData).subscribe({
        next: (res) => {
          console.log(res.body);
          this.feedbackMsg = res.body;
          this.success = true;
        },
        error: (err) => {
          console.error(err);
          this.feedbackMsg = "user not found or already confirmed";
          this.success = false;
        }
      });
    }
  }
}
