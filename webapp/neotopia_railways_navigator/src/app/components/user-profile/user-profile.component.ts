import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsernameDto } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDeleteDialogComponent } from '../dialog/confirm-delete-dialog/confirm-delete-dialog.component';

export interface ConfirmDeleteDialogData {
  username: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  public loggedUser: string | null = "";

  constructor(public dialog: MatDialog, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loggedUser = sessionStorage.getItem('logged_user');
  }

  public onLogOut() {
    this.userService.logOut().subscribe({
      next: (res) => {
        console.log('logged out');
      },
      error: (err) => {
        console.error(err.message);
      }
    })

    this.router.navigate(['/login']);
  }

  public onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { username: this.loggedUser },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.loggedUser && result == true) {
        const deleteData: UsernameDto = new UsernameDto(this.loggedUser);
        this.userService.deleteUser(deleteData).subscribe({
          next: (res) => {
            console.log("Delete confirmed");
            this.onLogOut();
          },
          error: (err) => {
            console.error(err.message);
          }
        });
      }
    });
  }
}
