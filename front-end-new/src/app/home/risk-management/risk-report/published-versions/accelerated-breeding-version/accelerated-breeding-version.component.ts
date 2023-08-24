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
import { RiskReport } from 'src/app/shared-model/risk-report-data/risk-report.model';

import { ApiRiskReportService } from 'src/app/shared-services/risk-report-services/api-risk-report.service';

@Component({
  selector: 'app-accelerated-breeding-version',
  templateUrl: './accelerated-breeding-version.component.html',
  styleUrls: ['./accelerated-breeding-version.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AcceleratedBreedingVersionComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  expandedElement!: RiskReport | null;

  panelOpenState = false;

  constructor(private apiRiskReport: ApiRiskReportService) {}

  dataSource = new MatTableDataSource(this.apiRiskReport.riskReportData);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'CurrentRiskLevel',
    'targetRiskLevel',
    'riskOwner',
    'createdBy',

    'action',
  ];
  onExportToExcel() {}

  onClickView() {
    //  this.router.navigate(['accelerated-breeding-version'], {
    //    relativeTo: this.route,
    //  });
  }
}
