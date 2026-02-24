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
// import { RiskReportOverviewComponent } from '../risk-report-overview/risk-report-overview.component';
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

  public async SavePDF(): Promise<void> {
    const risks: any[] = this.AllRisk?.risks || this.dataSource?.data || [];

    const top5 = [...risks]
      .sort(
        (a: any, b: any) =>
          b.current_likelihood * b.current_impact -
          a.current_likelihood * a.current_impact
      )
      .slice(0, 5);

    const logoBase64 = await this.getBase64FromUrl(
      'assets/shared-image/cgiar-logo.png'
    );

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const themeR = 67, themeG = 98, themeB = 128;

    // Header bar
    doc.setFillColor(themeR, themeG, themeB);
    doc.rect(0, 0, pageWidth, 30, 'F');

    // CGIAR logo in header
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, 5, 40, 20);
    }

    // "PRMS Risk Management" in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PRMS Risk Management', pageWidth - margin, 19, { align: 'right' });

    let y = 42;

    // Initiative name
    doc.setTextColor(themeR, themeG, themeB);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(
      this.sciencePrograms?.name || this.scienceProgramsId || '',
      margin,
      y
    );
    y += 9;

    // Subtitle
    const year = new Date().getFullYear();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Top 5 Submitted Risks and Mitigating Actions for ${year}`,
      margin,
      y
    );
    y += 7;

    // Separator line
    doc.setDrawColor(themeR, themeG, themeB);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 9;

    top5.forEach((risk: any, index: number) => {
      const title = `${index + 1}. ${risk.title || ''}`;
      const description = risk.description || '';
      const ownerName =
        risk.risk_owner?.user?.full_name || risk.risk_owner?.email || 'N/A';
      const hasMitigations = risk.mitigations?.length > 0 ? 'Yes' : 'No';
      const deadline = risk.due_date
        ? new Date(risk.due_date).toLocaleDateString('en-GB')
        : null;

      if (y > 247) {
        doc.addPage();
        y = 20;
      }

      // Risk title
      doc.setTextColor(themeR, themeG, themeB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6 + 2;

      // Description
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(description, contentWidth);
      if (y + descLines.length * 5 > 267) {
        doc.addPage();
        y = 20;
      }
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 4;

      // Risk Owner
      if (y > 267) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Owner: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(ownerName, margin + doc.getTextWidth('Risk Owner: '), y);
      y += 6;

      // Mitigating Actions
      if (y > 267) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('Mitigating Actions in place: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(
        hasMitigations,
        margin + doc.getTextWidth('Mitigating Actions in place: '),
        y
      );
      y += 6;

      // Deadline
      if (deadline) {
        if (y > 267) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text('Deadline: ', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(deadline, margin + doc.getTextWidth('Deadline: '), y);
        y += 6;
      }

      // Divider between risks
      y += 3;
      if (y <= 267) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
      }
      y += 6;
    });

    doc.save(`Risk-Report-${this.scienceProgramsId}.pdf`);
  }

  private getBase64FromUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = url;
    });
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
  scienceProgramsId: any;
  riskUsers: any;
  my_roles: any;
  locked: any = {};
  connection = true;
  sciencePrograms:any;
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
    console.log(this.user_info);
    // my_roles

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.scienceProgramsId = params.initiativeId;
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.sciencePrograms = await this.initiativeService.getInitiative(this.id);
    this.my_risks = this.sciencePrograms.risks
    .filter(
      (d: any) =>
        d?.risk_owner && d?.risk_owner?.user?.id == this.user_info.id
    )
    .map((d: any) => d);

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
        // maxWidth: '400px',
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
    await this.riskService.updateRedundant(id, this.id , value);
    this.refresh.emit();
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
      <td style=" width: 55rem;padding: 1rem; border: 1px solid #b9b9b9b5;color: #0f212f;text-align: justify; font-family: Poppins;font-size: 1.3rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation.description}</td>
      <td style=" width: 20rem;padding: 1rem;border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center; font-family: Poppins;font-size: 1.3rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation?.status?.title}</td></tr>`
      );
    });
    let html = `
   <div class="table-box">
   <div class="table-box ">
                <table class="mat-elevation-z8 table-box " style=" width: 100%; overflow: auto; margin-top: 1rem; margin-bottom: 4rem;">
                  <tr>
                    <th  style="width:55rem;padding:1rem; font-family: Poppins;font-size: 1.4rem;font-weight: 500;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Actions/Controls description</th>
                    <th style=" width: 20rem; padding: 1rem; font-family: Poppins;font-size: 1.4rem;font-weight: 500;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Status</th>
                  </tr>
                  ${mitigationsList.join('')}
                </table>
                </div>`;

    if (mitigationsList.length > 0) return html;
    else return '';
  }
}
