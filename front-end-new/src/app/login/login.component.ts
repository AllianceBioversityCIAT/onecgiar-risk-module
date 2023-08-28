import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public router: Router
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
        this.router.navigate(['./home/risk-management']);
        this.dialogRef.close(result);
    } else this.error = 'Please enter a valid email address';
  }
}
