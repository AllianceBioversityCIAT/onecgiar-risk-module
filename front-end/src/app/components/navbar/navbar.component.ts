import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../confirm/confirm.component';
@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {
  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  async login() {
    const result: any = await this.userService.login(this.data.email);
    if (result) {
      localStorage.setItem('access_token', result.access_token);
      window.location.href = window.location.href;
    }
  }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(public dialog: MatDialog) {}
  user_info: any;
  bredcrumbs: any[] = [
    { label: 'home', path: '/' },
    { label: 'id', path: '/' },
    { label: 'pag', path: '/' },
  ];

  ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
      console.log('user_info', this.user_info);
    }
  }
  logout() {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Logout',
          `Are you sure you want to logout?`
        ),
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          localStorage.removeItem('access_token');
          window.location.href = window.location.href;
        }
      });
  }
  login() {
    const dialogRef = this.dialog.open(LoginDialog, {
      data: { email: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
