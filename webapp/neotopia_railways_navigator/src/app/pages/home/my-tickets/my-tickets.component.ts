import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent {

  public currentUser?: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    const username: string | null = localStorage.getItem('logged_user')
    if (username) {
      this.userService.fetchUser(username).subscribe({
        next: (res) => {
          console.log(res);
          this.currentUser = res;
        },
        error: (err) => { console.log(err) }
      });
    }
  }
}
