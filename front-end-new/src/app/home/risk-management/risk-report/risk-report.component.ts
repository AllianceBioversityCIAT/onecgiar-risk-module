import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RiskReport } from 'src/app/shared-model/risk-report-data/risk-report.model';
import { ApiRiskReportService } from 'src/app/shared-services/risk-report-services/api-risk-report.service';
import { SubmitRiskDialogComponent } from './submit-risk-dialog/submit-risk-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiActionsControlsService } from 'src/app/shared-services/actions-controls-services/api-actions-controls.service';
import { ActionsControls } from 'src/app/shared-model/actions-controls-data/actions-controls.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-report',
  templateUrl: './risk-report.component.html',
  styleUrls: ['./risk-report.component.scss'],
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
export class RiskReportComponent {
  expandedElement!: RiskReport | null;
  public url1: string = '';

  public riskUrl = {
    home: '/home/risk-management/risk-report',
  };

  constructor(
    private apiActionsControlsService: ApiActionsControlsService,
    private apiRiskReport: ApiRiskReportService,
    public router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  riskManagementForm = new FormGroup({});

  mitigationsList: ActionsControls[] = [];

  ngOnInit() {
    this.url1 = this.router.url;
    this.mitigationsList = this.apiActionsControlsService.actionsControlsData;
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.generateTable());
  }

  dataSource = new MatTableDataSource(this.apiRiskReport.riskReportData);
  html: any;
  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'CurrentRiskLevel',
    'targetRiskLevel',
    'riskOwner',
    'createdBy',
    'dueDate',
    'action',
  ];

  dataSourcex = new MatTableDataSource(
    this.apiActionsControlsService.actionsControlsData
  );

  displayedColumnss: string[] = ['description', 'status'];
  // @Input()
  // public expanded: boolean = false;

  // @Output()
  // public expandedChange: EventEmitter<boolean> = new EventEmitter();

  public toggle() {
    // this.expanded = !this.expanded;
    // this.expandedChange.next(this.expanded);
  }
  onReset() {}
  onExportToExcel() {}

  panelOpenState = false;

  openDialogSubmitRisk(title: any) {
    this.dialog.open(SubmitRiskDialogComponent, {
      width: '68rem',
      height: '50.2rem',
      data: {
        title: title,
      },
    });
  }

  deleteRiskReportById(id: any) {
    this.apiRiskReport
      .openDialogDeleteRiskReport('Are you sure to delete this record ?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
        }
      });
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
