import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from '../header.service';
import { AuthService } from '../services/auth.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notificationNumberCount: number;

  envp: any;

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
    public headerService: HeaderService,
    private authService: AuthService
  ) {
    this.notificationNumberCount = 5;
    this.headerService.background = '#0f212f';

    this.envp = environment.production;
    console.log(this.envp);
  }

  user_info: any;
  loading = true;
  isadmin = false;
  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (this.headerService.background == '#04030f') this.isadmin = true;
      else this.isadmin = false;
      this.user_info = this.authService.getLogedInUser();
    });
    this.loadingService.loadingSub.pipe(delay(0)).subscribe((d) => {
      if (this.headerService.background == '#04030f') this.isadmin = true;
      else this.isadmin = false;
      this.loading = d;
    });
  }

  logout() {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Logout',
          message: 'Are you sure you want to logout?',
          svg: `../../assets/shared-image/logout.png`,
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
      this.authService.goToLogin();
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

  public adminUrl = {
    admin: '/admin',
    userManagement: '/admin/user-management',
    parameterSetttings: '/admin/parameters-settings',
    categories: '/admin/category',
    mitigation: '/admin/mitigation-status',
    settings: '/admin/parameters-settings/settings',
    announcements: '/admin/announcements',
    posted: '/admin/announcements/posted',
    drafts: '/admin/announcements/drafts',
    glossary: '/admin/glossary',
    faq: '/admin/faq',
    pageNotFounds: '/404',
  };
}
