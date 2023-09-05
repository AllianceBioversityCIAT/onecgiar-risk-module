import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { SettingsComponent } from './settings/settings.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-parameters-settings',
  templateUrl: './parameters-settings.component.html',
  styleUrls: ['./parameters-settings.component.scss'],
})
export class ParametersSettingsComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  j: any;
  constructor(
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {
    this.title.setTitle('Parameters settings');
    this.meta.updateTag({
      name: 'description',
      content: 'Parameters settings',
    });
  }
}
