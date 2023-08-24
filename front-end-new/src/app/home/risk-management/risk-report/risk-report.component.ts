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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RiskReport } from 'src/app/shared-model/risk-report-data/risk-report.model';
import { ApiRiskReportService } from 'src/app/shared-services/risk-report-services/api-risk-report.service';
import { SubmitRiskDialogComponent } from './submit-risk-dialog/submit-risk-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  public riskUrl = {
    home: '/home/risk-management/risk-report',
  };

  constructor(
    private apiRiskReport: ApiRiskReportService,
    public router: Router,
    private dialog: MatDialog
  ) {}

  riskManagementForm = new FormGroup({});

  ngOnInit() {
    this.url1 = this.router.url;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(this.apiRiskReport.riskReportData);

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'CurrentRiskLevel',
    'targetRiskLevel',
    'riskOwner',
    'createdBy',
    'redundant',
    'action',
  ];
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
}
