import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
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
@Component({
  selector: 'app-risk-table',
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.scss'],
})
export class RiskTableComponent {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}
  @Input() dataSource: any;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  @Input() savePdf: EventEmitter<any> = new EventEmitter<any>();

  @Input() showingVersion: boolean = false;
  @ViewChild('pdfcontent') pdfcontent: ElementRef = new ElementRef('');

  toPdf: boolean = false;

  public SavePDF(): void {
    this.toPdf = true;
   let  actions = false
   if(this.displayedColumns.includes('Actions')){
   this.displayedColumns.pop();
   actions = true
  }
    setTimeout(() => {
      let content = this.pdfcontent.nativeElement;
      this.pdfcontent.nativeElement.width;
      let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [
          this.pdfcontent.nativeElement.scrollWidth,
          this.pdfcontent.nativeElement.scrollHeight+3,
        ],
      });
      doc.html(
        content.innerHTML,
        {
          callback: (doc) => {
            doc.save('Risks-' + this.initiativeId + '-' + this.id + '.pdf');
            this.toPdf = false;
            if(actions)
            this.displayedColumns.push('Actions')
          },
        }
      );
    }, 500);
  }
  displayedColumns: string[] = [
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
    'Mitigation Action',
    'Risk Owner',
    'created_by',
    'Flag to SDG',
    'Redundant',
  ];

  user_info: any;
  id: any;
  initiativeId: any;
  riskUsers: any;
  my_roles: any;
  async ngOnInit() {
    this.savePdf.subscribe(()=>{
      this.SavePDF()
    })
    this.user_info = this.userService.getLogedInUser();
    // my_roles
    if(this.user_info.role != 'admin'){
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
      'Mitigation Action',
      'Risk Owner',
      'created_by',
      'Redundant'
      ]; 
    }

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.initiativeId = params.initiativeId;
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    if (this.canEdit() && !this.showingVersion && !this.toPdf)
      this.displayedColumns.push('Actions');
  }

  editRisk(data: any) {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: { taskRole: 'edit', risk: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refresh.emit(result);
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
      this.my_roles.includes(ROLES.CO_LEADER)
    );
  }

  filterDescriptionMitigations(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr style="border:none !important;"><td style="padding-right: 5px;border:none !important;width:65%;border-top: 1px solid #e0e0e0 !important;text-align: justify;">${mitigation.description}</td><td style="padding-left: 5px;border:none !important;;width:25%;border-top: 1px solid #e0e0e0 !important;">${mitigation.status}</td></tr>`
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
