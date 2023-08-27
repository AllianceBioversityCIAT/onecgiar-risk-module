import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';
import jwt_decode from 'jwt-decode';
import { delay } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

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

  // @Output() clickEvent = new EventEmitter<{ userManagement: string }>();

  // public adminUrl = '/admin';

  // adminUrl for animation navlist of header when click admin-module the background-color of navlist will be change when click

  public adminUrl = {
    admin: '/admin',
    userManagement: '/admin/user-management',
    parameterSetttings: '/admin/parameters-settings',
    categories: '/admin/parameters-settings/categories',
    mitigation: '/admin/parameters-settings/mitigation-status',
    settings: '/admin/parameters-settings/settings',
    announcements: '/admin/announcements',
    posted: '/admin/announcements/posted',
    drafts: '/admin/announcements/drafts',
  };

  // riskUrl for animation navlist of header when cilick all list nav than admin-module will be change background-color when click on any navlist than without admin-module

  public riskUrl = {
    home: '/home/risk-management',
    riskManagement: '/home/risk-management/risk-report',
    riskReport: '/home/risk-management/risk-report/risk-report-form',
    published: '/home/risk-management/risk-report/published-versions',
    teamMembers: '/home/risk-management/risk-report/team-members',
    accelerated:
      '/home/risk-management/risk-report/published-versions/accelerated-breeding-version',
    about: '/about',
    glossary: '/glossary',
    faq: '/faq',
    dashboard: '/dashboard',
  };








  constructor(
    public dialog: MatDialog,
    private loadingService: LoadingService,
    public router: Router
  ) {
    this.notificationNumberCount = 5;
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
    console.log(this.user_info)
  }



  logout() {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
         title: 'Logout',
         message:  'Are you sure you want to logout?',
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
      const dialogRef = this.dialog.open(LoginComponent, {
          minWidth: '350px',
        data: { email: '' },
      }).afterClosed().subscribe((result) => {
        if(result) {
        window.location.href = window.location.href;
        }
      });
    }
  }
  homeRoute:any = './home/risk-management';
  accessHome() {
    if(this.user_info) {
      this.homeRoute = './home/risk-management';
    }
    else {
      this.login();
    }
  }
}
