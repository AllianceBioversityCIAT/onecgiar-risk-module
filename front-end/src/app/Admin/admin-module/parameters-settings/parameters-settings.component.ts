import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { SettingsComponent } from './settings/settings.component';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-parameters-settings',
  templateUrl: './parameters-settings.component.html',
  styleUrls: ['./parameters-settings.component.scss'],
})
export class ParametersSettingsComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  j: any;
  constructor(private headerService: HeaderService) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {}
}
