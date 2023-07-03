import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from 'src/app/components/confirm/confirm.component';
import { NewRiskComponent } from 'src/app/components/new-risk/new-risk.component';
import { ROLES } from 'src/app/components/new-team-member/new-team-member.component';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { AppSocket } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'publish-dialog',
  templateUrl: 'publish-dialog.html',
  styleUrls: ['./publish-dialog.scss'],
})
export class PublishDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PublishDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private initiativeService: InitiativesService
  ) {}
  tops: any = null;
  error: boolean = false;

  async ngOnInit() {
    this.tops = await this.initiativeService.getTopRisks(
      this.data.initiative_id
    );
    this.top = this.tops.top as [];
    this.similar = this.tops.similar as [];
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  async publish() {
    this.error = false;
    if (this.data.top.length == 5 && this.data.reason != '')
      this.dialogRef.close(this.data);
    else this.error = true;
  }
  toparray = [];

  similararray = [];

  top: any[] = [];

  similar: any[] = [];
  evenPredicate(item: any): any {
    return this.data?.length < 5;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.data.top = this.top;
  }
}

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss'],
})
export class InitiativeDetailsComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService,
    private variableService: VariableService,
    private socket: AppSocket
  ) {}

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
          this.loadRisks();
          this.toastr.success('Success', `${risk.title} has been deleted`);
        }
      });
  }
  async deleteMitigationRisk(risk: any) {
    risk.mitigations.forEach(async (mitigation: any) => {
      await this.riskService.deleteMitigation(risk.id, mitigation.id);
    });
  }

  openNewRiskDialog() {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: { initiative_id: this.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadRisks();
    });
  }

  dataSource: any = new MatTableDataSource<any>([]);
  initiative: any = null;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async export(id: number, official_code: string) {
    await this.initiativeService.getExportByinititave(id, official_code);
  }
  savePdf: EventEmitter<any> = new EventEmitter<any>();
  exportPdf() {
    this.savePdf.emit();
  }
  refresh(data: any = null) {
    this.loadRisks();
  }
  async publish(id: number) {
    this.dialog
      .open(PublishDialog, {
        height: '800px',
        maxWidth: '700px',
        data: { reason: '', initiative_id: this.id, top: [] },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.initiativeService.Publish(id, dialogResult);

          this.toastr.success(
            'Success',
            `Risks for ${this.initiative.name} has been published successfully`
          );
          this.loadRisks();
        }
      });
  }
  async checkValue(id: number, value: any) {
    await this.riskService.updateRedundant(id, value);
  }
  my_risks: any = null;
  async loadInitiative() {
    this.initiative = await this.initiativeService.getInitiative(this.id);
    this.latest_version =
      await this.initiativeService.getInitiativeLatestVersion(this.id);
    this.my_risks = this.initiative.risks
      .filter(
        (d: any) =>
          d?.risk_owner && d?.risk_owner?.user?.id == this.user_info.id
      )
      .map((d: any) => d);

    console.log('initiative  this.riskOwners', this.my_risks);
    this.dataSource = new MatTableDataSource<any>(
      await this.riskService.getRisks(this.id)
    );
    this.NumberOfRisks = this.dataSource._renderData._value.length;
  }

  async loadRisks() {
    this.dataSource = new MatTableDataSource<any>(
      await this.riskService.getRisks(this.id, this.filters)
    );
    this.reload = false;
    setTimeout(async () => {
      await this.loadInitiative();
      this.reload = true;
    }, 500);
  }
  NumberOfRisks: any;
  versionId: any;
  initiativeId: any;
  user_info: any;
  my_roles: string[] = [];
  riskUsers: any;
  id: number = 0;
  latest_version: any;
  reload = true;
  publishStatus!: any;
  publishLocalStoreg!: any;
  async ngOnInit() {
    this.publishStatus = await this.variableService.getPublishStatus();
    this.user_info = this.userService.getLogedInUser();
    // my_roles

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.initiativeId = params.initiativeId;
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.latest_version =
      await this.initiativeService.getInitiativeLatestVersion(this.id);
    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    console.log(this.my_roles);
    this.loadInitiative();

    this.socket.connect();
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
  canPublish() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles.includes(ROLES.LEAD) ||
      this.my_roles.includes(ROLES.COORDINATOR)
    );
  }
  filters: any;
  filter(filters: any) {
    this.filters = filters;
    this.loadRisks();
  }
  canEdit() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles.includes(ROLES.LEAD) ||
      this.my_roles.includes(ROLES.COORDINATOR)
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
