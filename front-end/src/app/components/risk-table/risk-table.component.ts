import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { UserService } from 'src/app/services/user.service';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../confirm/confirm.component';
import { NewRiskComponent } from '../new-risk/new-risk.component';
import { ROLES } from '../new-team-member/new-team-member.component';
import { jsPDF } from 'jspdf';
import { AppSocket } from 'src/app/services/socket.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-risk-table',
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' , display: 'none'})),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RiskTableComponent {
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
    private cd: ChangeDetectorRef

  ) {}
  @Input() dataSource: any;
  @Input() AllRisk: any;
  

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  @Input() savePdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() my_risks: any;
  @Input() showingVersion: boolean = false;
  @Input() showReduntent: boolean = true;

  @ViewChild('pdfcontent') pdfcontent: ElementRef = new ElementRef('');

  innerDisplayedColumns = ['full_name',  'target_impact', 'target_likelihood', 'current_impact', 'current_likelihood' , 'mitigations'];
  expandedElement: any ;

  toggleRow(element: any) {
    element.data && (element.data as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }


  toPdf: boolean = false;

  public SavePDF(): void {
    if (this.user_info.role != 'admin') {
      this.displayedColumns = [
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
        'Redundant',
        'Actions'
      ];
    }
    else {
      this.displayedColumns = [
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
        'Redundant',
        'Actions'
      ];
    }

    this.toPdf = true;
    let actions = false;
    let redundant = false;
    if (this.displayedColumns.includes('Actions')) {
      this.displayedColumns.pop();
      actions = true;
      if (this.displayedColumns.includes('Redundant')) {
        this.displayedColumns.pop();
        redundant = true;
      }
    }
    setTimeout(() => {
      let content = this.pdfcontent.nativeElement;
      this.pdfcontent.nativeElement.width;
      let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [
          this.pdfcontent.nativeElement.scrollWidth,
          this.pdfcontent.nativeElement.scrollHeight + 3,
        ],
      });
      doc.html(content.innerHTML, {
        callback: (doc) => {
          this.displayedColumns = [
            'ID',
            'Risk Title',
            'Risk Category',
            'Current Risk Level',
            'Target Risk Level',
            'Risk Owner',
            'created_by',
          ];
          doc.save('Risks-' + this.initiativeId + '-' + this.id + '.pdf');
          this.toPdf = false;
          if (redundant) this.displayedColumns.push('Redundant');
          if (actions) this.displayedColumns.push('Actions');
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
    'Redundant',
  ];

  user_info: any;
  id: any;
  initiativeId: any;
  riskUsers: any;
  my_roles: any;
  locked: any={};
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

    if(this.showReduntent == false && this.displayedColumns.includes('Redundant')) {
      this.displayedColumns.pop();
    }
  }
  unlock(risk_id: any) {
    console.log('unlock');
    this.socket.emit('risk-unlock', risk_id);
  }
  editRisk(data: any) {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: { taskRole: 'edit', risk: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refresh.emit(result);
      this.unlock(data.id);
    });
  }

  async deleteRisk(risk: any) {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Delete',
          `Are you sure you want to delete risk ${risk.title} ?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.riskService.deleteRisk(risk.id);
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
  }
  canEdit() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles.includes(ROLES.LEAD) ||
      this.my_roles.includes(ROLES.COORDINATOR)
    );
  }
  canEditOwner(element: any) {
    return this.my_risks.filter((d: any) => d.id == element.id).length > 0;
  }
  filterDescriptionMitigations(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr style="border:none !important;"><td style="padding-right: 5px;border:none !important;width:65%;border-top: 1px solid #e0e0e0 !important;text-align: justify;">${mitigation.description}</td><td style=";padding-left: 5px;border:none !important;;width:25%;border-top: 1px solid #e0e0e0 !important;">${mitigation?.status?.title}</td></tr>`
      );
    });
    let html = `
  <table style="border:none !important;">
  <tr>
  <th style="border:none !important; text-align:left;width:70%;">Description</th>
  <th style="border:none !important; text-align:center;width:30%;">Status</th>
 
</tr>
${mitigationsList.join('')}
</table>`;
    if (mitigationsList.length) return html; // ;
    else return '';
  }
}
