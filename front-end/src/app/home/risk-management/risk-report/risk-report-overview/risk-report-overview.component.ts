import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import {
//   ConfirmComponent,
//   ConfirmDialogModel,
// } from 'src/app/components/confirm/confirm.component';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { AppSocket } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { Meta, Title } from '@angular/platform-browser';
import { SubmitRiskDialogComponent } from '../submit-risk-dialog/submit-risk-dialog.component';
import { ROLES } from '../team-members/team-members.component';
import { PhasesService } from 'src/app/services/phases.service';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-risk-report-overview',
  templateUrl: './risk-report-overview.component.html',
  styleUrls: ['./risk-report-overview.component.scss'],
})
export class RiskReportOverviewComponent implements OnInit {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService,
    private variableService: VariableService,
    private phaseService: PhasesService,
    private organizationService: OrganizationService,
    private socket: AppSocket,
    private title: Title,
    private meta: Meta
  ) {
    console.log('Risk report');
    this.title.setTitle('Risk report');
    this.meta.updateTag({
      name: 'description',
      content: 'Risk report',
    });
  }

  async deleteRisk(risk: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        // maxWidth: '400px',
        // data: new ConfirmDialogModel(
        //   'Delete',
        //   `Are you sure you want to delete risk ${risk.title} ?`
        // ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.riskService.deleteRisk(risk.id, null);
          this.loadInitiative();
          this.toastr.success('Success', `${risk.title} has been deleted`);
        }
      });
  }
  async deleteMitigationRisk(risk: any) {
    risk.mitigations.forEach(async (mitigation: any) => {
      await this.riskService.deleteMitigation(risk.id, mitigation.id);
    });
  }


  dataSource: any = new MatTableDataSource<any>([]);
  dataSourceForPdf: any = new MatTableDataSource<any>([]);
  sciencePrograms: any = null;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  savePdf: EventEmitter<any> = new EventEmitter<any>();
  exportPdf() {
    this.savePdf.emit();
  }
  refresh(data: any = null) {
    this.loadInitiative();
  }
  async publish(id: number) {
    this.dialog
      .open(SubmitRiskDialogComponent, {
        maxHeight: '800px',
        maxWidth: '700px',
        data: { initiative_id: this.id, top: [] },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.initiativeService.Publish(id, dialogResult);

          this.toastr.success(
            `Risks for ${this.sciencePrograms.name} has been submitted successfully`
          );
          this.loadInitiative();
        }
      });
  }
  async checkValue(id: number, value: any) {
    await this.riskService.updateRedundant(id, this.id, value);
  }
  my_risks: any = null;
  async loadInitiative() {
    this.sciencePrograms = await this.initiativeService.getInitiative(this.id);
    this.latest_version =
      await this.initiativeService.getInitiativeLatestVersion(this.id);
    this.my_risks = this.sciencePrograms.risks
      .filter(
        (d: any) =>
          d?.risk_owner && d?.risk_owner?.user?.id == this.user_info.id
      )
      .map((d: any) => d);

    this.AllRisk = await this.riskService.getRisks(this.id, this.filters);
    this.dataSource = new MatTableDataSource<any>(this.AllRisk.risks);
    this.NumberOfRisks = this.dataSource._renderData._value.length;
    this.dataSourceForPdf = new MatTableDataSource<any>(this.AllRisk.risks);
    if (
      this.AllRisk?.redundentRisk?.length != 0 &&
      this.AllRisk?.risks?.length == 0
    ) {
      this.toolTipMessage = 'All Risks are redundant';
    }
    if (
      this.AllRisk?.redundentRisk?.length == 0 &&
      this.AllRisk?.risks?.length == 0 &&
      this.AllRisk?.notredundentRisk?.length == 0
    ) {
      this.toolTipMessage = 'There is no risks';
    }
    console.log(this.AllRisk);
    // check if all risks are redundent
    this.isTrue = this.AllRisk.risks.every((obj: any) => obj.redundant == true);
  }
  async loadRisks() {
    this.AllRisk = await this.riskService.getRisks(this.id, this.filters);
    this.dataSource = new MatTableDataSource<any>(this.AllRisk.risks);
    this.isTrue = this.AllRisk.risks.every((obj: any) => obj.redundant == true);
    this.dataSourceForPdf = new MatTableDataSource<any>(this.AllRisk.risks);
  }
  isTrue: boolean = false;
  AllRisk: any;
  NumberOfRisks: any;
  versionId: any;
  scienceProgramsId: any;
  user_info: any;
  my_roles: string[] = [];
  riskUsers: any;
  id: number = 0;
  latest_version: any;
  reload = true;
  publishStatus!: any;
  publishLocalStoreg!: any;
  toolTipMessage: any;
  activePhase: any;
  assignOrg: any;
  async ngOnInit() {
    this.publishStatus = await this.variableService.getPublishStatus();
    this.user_info = this.userService.getLogedInUser();
    // my_roles

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.scienceProgramsId = params.initiativeId;

    this.activePhase = await this.phaseService.getActivePhase();
    this.assignOrg = await this.organizationService.getOrganizationsByProgramId(this.id);
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.latest_version =
      await this.initiativeService.getInitiativeLatestVersion(this.id);
    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    this.loadInitiative();

    if (this.publishStatus.value == '0') {
      this.toolTipMessage = 'Admin closed submit';
    }
    if (!this.canPublish()) {
      this.toolTipMessage = 'Team Member/Guest can not submit';
    }
  }

  canPublish() {
    return (
      this.user_info?.role == 'admin' ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR)
    );
  }
  filters: any;
  filter(filters: any) {
    this.filters = filters;
    this.loadRisks();
  }
  canEdit() {
    return (
      this.user_info?.role == 'admin' ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR)
    );
  }

  filterDescriptionMitigations(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr style="border: 1px black solid !important;"><td style="border:none !important;width:70%;border-top: 1px solid #e0e0e0 !important;text-align: justify;">${mitigation.description}</td><td style="border:none !important;;width:30%;border-top: 1px solid #e0e0e0 !important;">${mitigation.status}</td></tr>`
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
