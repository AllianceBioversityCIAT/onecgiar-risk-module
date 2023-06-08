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
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'rxjs';
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
  error: string | null = null;
  async login() {
    const result: any = await this.userService.login(this.data.email);
    console.log(result);
    if (result) {
      this.error = null;
      localStorage.setItem('access_token', result.access_token);
      window.location.href = window.location.href;
    } else this.error = 'Please enter a valid email address';
  }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    public dialog: MatDialog,
    private loadingService: LoadingService
  ) {}
  user_info: any;
  bredcrumbs: any[] = [
    { label: 'home', path: '/' },
    { label: 'id', path: '/' },
    { label: 'pag', path: '/' },
  ];
  loading = true;
  ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
    }
    this.loadingService.loadingSub.pipe(delay(0)).subscribe((d) => {
      this.loading = d;
    });
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
          this.user_info = null;
          window.location.href = window.location.href;
        }
      });
  }
  login() {
    if (this.user_info) this.logout();
    else {
      const dialogRef = this.dialog.open(LoginDialog, {
          minWidth: '350px',
        data: { email: '' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
      });
    }
  }
}
