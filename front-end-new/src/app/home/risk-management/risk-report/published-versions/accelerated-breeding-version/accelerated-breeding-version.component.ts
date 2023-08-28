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
import { Router } from '@angular/router';
import { ApiActionsControlsService } from 'src/app/shared-services/actions-controls-services/api-actions-controls.service';

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

  constructor(
    private apiActionsControlsService: ApiActionsControlsService,
    private apiRiskReport: ApiRiskReportService,
    public router: Router,

    private sanitizer: DomSanitizer
  ) {}

  dataSource = new MatTableDataSource(this.apiRiskReport.riskReportData);

  mitigationsList: ActionsControls[] = [];
  html: any;

  ngOnInit() {
    this.mitigationsList = this.apiActionsControlsService.actionsControlsData;
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.generateTable());
  }

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

  generateTable() {
    const mitigationsList = this.mitigationsList.map((mitigation: any) => {
      return `<tr>
      <td style=" width: 55rem;padding: 1rem; border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center;font-family: Inter, sans-serif !important;font-size: 1.2rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation.description}</td>
      <td style=" width: 20rem;padding: 1rem;border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center;font-family: Inter, sans-serif !important;font-size: 1.2rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation?.status}</td></tr>`;
    });
    let html = `
   <div class="table-box">
   <div class="table-box example-container">
                <table class="mat-elevation-z8 table-box example-container" style=" width: 100%; overflow: auto; margin-top: 1rem; margin-bottom: 4rem;">
                  <tr>
                    <th  style="width:55rem;padding:1rem; font-family: Inter;sans-serif !important;font-size: 1.2rem;font-weight: 600;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Actions/Controls description</th>
                    <th style=" width: 20rem; padding: 1rem; font-family: Inter;sans-serif !important;font-size: 1.2rem;font-weight: 600;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Status</th>
                  </tr>
                  ${mitigationsList.join('')}
                </table>
                </div>`;

    if (mitigationsList.length > 0) return html;
    else return '';
  }
}
