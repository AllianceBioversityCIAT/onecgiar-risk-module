import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';
import jwt_decode from 'jwt-decode';
import { delay } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notificationNumberCount: number;

  increment() {
    this.notificationNumberCount++;
  }
  clear() {
    this.notificationNumberCount = 0;
  }

  @ViewChild('menuBtn1', { read: MatMenuTrigger, static: false })
  menu1: MatMenuTrigger | any;

  foo() {
    this.menu1.openMenu(); // also closeMenu()
  }

  public url1: string = '';
  componentName: any = {
    userManagement: 'user-management',
    parametersSettings: 'parameters-settings',
    announcements: 'announcements',
  };

 

  

  constructor(
    public dialog: MatDialog,
    private loadingService: LoadingService,
    public router: Router,
    public headerService: HeaderService
  ) {
    this.notificationNumberCount = 5;
    this.headerService.background = '#0f212f';
  }

  user_info: any;
  loading = true;
  ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
    }
    this.loadingService.loadingSub.pipe(delay(0)).subscribe((d) => {
      this.loading = d;
    });
    console.log(this.user_info);
  }

  logout() {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Logout',
          message: 'Are you sure you want to logout?',
        },
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          localStorage.removeItem('access_token');
          this.user_info = null;
          this.router.navigate(['./about']);
        }
      });
  }
  login() {
    if (this.user_info) this.logout();
    else {
      const dialogRef = this.dialog
        .open(LoginComponent, {
          minWidth: '350px',
          data: { email: '' },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            window.location.href = window.location.href;
          }
        });
    }
  }
  homeRoute: any = './home';

  accessHome() {
    if (this.user_info) {
      this.homeRoute = './home';
    } else {
      this.login();
    }
  }
}
