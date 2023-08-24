import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { MatMenuTrigger } from '@angular/material/menu';

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

  constructor(public router: Router, public headerService: HeaderService) {
    this.notificationNumberCount = 5;
  }
  ngOnInit() {
    this.url1 = this.router.url;
  }

  onUserName() {}

  onLogout() {}

  // onReload() {
  //   this.router.navigate(['/admin/user-management']);
  // }

  // createComponent() {
  //   this.clickEvent.emit(this.componentName.userManagement);
  // }
}
