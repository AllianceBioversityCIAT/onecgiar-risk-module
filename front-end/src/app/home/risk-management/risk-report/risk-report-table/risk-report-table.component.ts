import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RiskReportComponent } from '../risk-report.component';
import { LoadingService } from 'src/app/services/loading.service';
import { AppSocket } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { RiskService } from 'src/app/services/risk.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { jsPDF } from 'jspdf';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { ROLES } from '../team-members/team-members.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-report-table',
  templateUrl: './risk-report-table.component.html',
  styleUrls: ['./risk-report-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RiskReportTableComponent {
  expandedElement: any;

  // expandedElement!: RiskReport | null;
  public url1: string = '';

  public riskUrl = {
    home: '/home/risk-management/risk-report',
  };

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService,
    private socket: AppSocket,
    private loading: LoadingService,
    private cd: ChangeDetectorRef,
    private RiskReportComponent: RiskReportComponent,
    private titleService: Title
  ) {}

  @Input() dataSource: any;
  @Input() dataSourceForPdf: any;
  @Input() AllRisk: any;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  @Input() savePdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() my_risks: any;
  @Input() showingVersion: boolean = false;
  @Input() showReduntent: boolean = true;
  @Input() titlePage: any;

  @ViewChild('pdfcontent') pdfcontent: ElementRef = new ElementRef('');

  toPdf: boolean = false;

  public SavePDF(): void {
    if (this.user_info.role != 'admin') {
      this.displayedColumnsPdf = [
        'ID',
        'Risk Title',
        'Risk Description',
        'Risk Category',
        'Current Likelihood',
        'Current Impact',
        'Current Risk Level',
        'Target Likelihood',
        'Target Impact',
        'Target Risk Level',
        'due date',
        'Mitigation Action',
        'Risk Owner',
        'created_by',
      ];
    } else {
      this.displayedColumnsPdf = [
        'ID',
        'Risk Title',
        'Risk Description',
        'Risk Category',
        'Current Likelihood',
        'Current Impact',
        'Current Risk Level',
        'Target Likelihood',
        'Target Impact',
        'Target Risk Level',
        'due date',
        'Mitigation Action',
        'Risk Owner',
        'created_by',
        'Flag to SDG',
      ];
    }

    this.toPdf = true;
    setTimeout(() => {
      let content = this.pdfcontent.nativeElement;
      this.pdfcontent.nativeElement.width;
      let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [
          this.pdfcontent.nativeElement.scrollWidth -63,
          this.pdfcontent.nativeElement.scrollHeight + 10,
        ],
      });
      doc.html(content.innerHTML, {
        callback: (doc) => {
          doc.save('Risks-' + this.initiativeId + '-' + this.id + '.pdf');
          this.toPdf = false;
        },
      });
    }, 500);
  }

  displayedColumns: string[] = [
    'ID',
    'Risk Title',
    'Risk Category',
    'Current Risk Level',
    'Target Risk Level',
    'Risk Owner',
    'created_by',
    'due date',
  ];

  displayedColumnsPdf: string[] = [];

  user_info: any;
  id: any;
  initiativeId: any;
  riskUsers: any;
  my_roles: any;
  locked: any = {};
  connection = true;

  async ngOnInit() {
    this.socket.on('locked', (data: any) => {
      this.locked = data;
      console.log('locked = >>>>>>>>', data);
    });
    this.socket.on('connect', () => {
      this.connection = true;
    });
    this.socket.on('disconnect', () => {
      this.dialog.closeAll();
      this.connection = false;
    });
    this.savePdf.subscribe(() => {
      this.SavePDF();
    });
    this.user_info = this.userService.getLogedInUser();
    console.log(this.user_info)
    // my_roles

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.initiativeId = params.initiativeId;
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    if (this.canEdit() && !this.showingVersion && !this.toPdf)
      this.displayedColumns.push('Actions');
    setTimeout(() => {
      if (this.my_risks?.length && !this.canEdit())
        this.displayedColumns.push('OwnerActions');
      console.log('OwnerActions', this.my_risks);
    }, 1000);

    if (
      this.showReduntent == false &&
      this.displayedColumns.includes('Redundant')
    ) {
      this.displayedColumns.pop();
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  unlock(risk_id: any) {
    console.log('unlock');
    this.socket.emit('risk-unlock', risk_id);
  }
  // editRisk(data: any) {
  //   const dialogRef = this.dialog.open(NewRiskComponent, {
  //     height: '90vh',
  //     data: { taskRole: 'edit', risk: data },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.refresh.emit(result);
  //     this.unlock(data.id);
  //   });
  // }

  async deleteRisk(risk: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Delete',
          message: `Are you sure you want to delete risk ${risk.title} ?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.riskService.deleteRisk(risk.id, this.id);
          this.refresh.emit();
          this.toastr.success('Success', `${risk.title} has been deleted`);
        }
      });
  }

  canPublish() {
    console.log(
      this.user_info.role == 'admin' || this.my_roles.includes(ROLES.LEAD)
    );
    return this.user_info.role == 'admin' || this.my_roles.includes(ROLES.LEAD);
  }
  async checkValue(id: number, value: any) {
    await this.riskService.updateRedundant(id, value);
    this.RiskReportComponent.loadInitiative();
  }
  canEdit() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR)
    );
  }
  canEditOwner(element: any) {
    return this.my_risks.filter((d: any) => d.id == element.id).length > 0;
  }

  html: any;

  panelOpenState = false;

  generateTable(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr>
      <td style=" width: 55rem;padding: 1rem; border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center;font-family: Inter, sans-serif !important;font-size: 1.2rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation.description}</td>
      <td style=" width: 20rem;padding: 1rem;border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center;font-family: Inter, sans-serif !important;font-size: 1.2rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation?.status?.title}</td></tr>`
      );
    });
    let html = `
   <div class="table-box">
   <div class="table-box ">
                <table class="mat-elevation-z8 table-box " style=" width: 100%; overflow: auto; margin-top: 1rem; margin-bottom: 4rem;">
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
