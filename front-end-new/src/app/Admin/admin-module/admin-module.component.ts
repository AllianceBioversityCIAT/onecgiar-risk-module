import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-admin-module',
  templateUrl: './admin-module.component.html',
  styleUrls: ['./admin-module.component.scss'],
})
export class AdminModuleComponent implements OnInit {
  container!: ViewContainerRef;

  componentName: any = {
    userManagement: 'user-management',
    parametersSettings: 'parameters-settings',
    announcements: 'announcements',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.headerService.background = 'gray';
  }

  ngOnInit(): void {}
}
