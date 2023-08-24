import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CategoriesComponent } from './categories/categories.component';
import { MitigationStatusComponent } from './mitigation-status/mitigation-status.component';
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

  constructor(private headerService: HeaderService) {
    this.headerService.background = '#dddddd';
  }

  ngOnInit(): void {}
}
