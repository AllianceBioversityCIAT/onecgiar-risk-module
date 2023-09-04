import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActionsControls } from 'src/app/shared-model/actions-controls-data/actions-controls.model';
import { RiskReport } from 'src/app/shared-model/risk-report-data/risk-report.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiRiskReportService } from 'src/app/shared-services/risk-report-services/api-risk-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiActionsControlsService } from 'src/app/shared-services/actions-controls-services/api-actions-controls.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-accelerated-breeding-version',
  templateUrl: './accelerated-breeding-version.component.html',
  styleUrls: ['./accelerated-breeding-version.component.scss'],
})
export class AcceleratedBreedingVersionComponent {
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private initiativesService: InitiativesService
  ) {}

  dataSource = new MatTableDataSource<any>([]);
  showReduntent: boolean = false;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  path: any = '';
  id: any;
  initiative: any;

  paarentRoute: any;

  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.snapshot.params;

    this.id = params.versionId;
    this.initiative = await this.initiativesService.getInitiativeForVersion(
      this.id
    );
    this.dataSource.data = this.initiative.risks;

    const params2 = this.activatedRoute.parent?.parent?.snapshot.params;
    console.log(params2);
    this.paarentRoute = params2;
  }

  async export() {
    await this.initiativesService.getExportByinititave(
      this.id,
      this.initiative.official_code,
      true
    );
  }
}
