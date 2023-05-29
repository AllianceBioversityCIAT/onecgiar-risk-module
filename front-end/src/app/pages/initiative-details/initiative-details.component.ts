import { Component, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from 'src/app/components/confirm/confirm.component';
import { NewRiskComponent } from 'src/app/components/new-risk/new-risk.component';
import { PublishDialogComponent } from 'src/app/components/publish-dialog/publish-dialog.component';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'publish-dialog',
  templateUrl: 'publish-dialog.html',
})
export class PublishDialog {
  constructor(
    public dialogRef: MatDialogRef<PublishDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  async publish() {
    this.dialogRef.close(this.data);
  }
}

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss'],
})
export class InitiativeDetailsComponent {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService
  ) {}

  editRisk(data: any) {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: { taskRole: 'edit', risk: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadInitiative();
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

  openPublishDialog() {
    this.dialog.open(PublishDialogComponent, {
      width: '600px',
    });
  }

  openNewRiskDialog() {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: { initiative_id: this.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadInitiative();
    });
  }

  displayedColumns: string[] = [
    'ID',
    'Risk Achieving Impact',
    'Risk Category',
    'Risk Owner',
    'Description Risk',
    'Current Likelihood',
    'Current Impact',
    'Current Risk Level',
    'Target Likelihood',
    'Target Impact',
    'Target Risk Level',
    'Mitigation Action',
    'created_by',
    'Flag to SDG',
    'Redundant',
    'Actions',
  ];
  dataSource: any = new MatTableDataSource<any>([]);
  initiative: any = null;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async export(id: number, official_code: string) {
    await this.initiativeService.getExportByinititave(id, official_code);
  }

  async publish(id: number) {
    this.dialog
      .open(PublishDialog, {
        maxWidth: '400px',
        data: { reason: '' },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.initiativeService.Publish(id, dialogResult);
        }
      });
  }
  async checkValue(id: number, value: any) {
    await this.riskService.updateRedundant(id, value);
  }

  async loadInitiative() {
    this.initiative = await this.initiativeService.getInitiative(this.id);
    this.dataSource = new MatTableDataSource<any>(this.initiative.risks);
  }
  versionId: any;
  initiativeId: any;
  id: number = 0;
  async ngOnInit() {
    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.initiativeId = params.initiativeId;
    this.loadInitiative();
  }

  filterDescriptionMitigations(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr><td style="border:none !important;">${mitigation.description}</td><td style="border:none !important;">${mitigation.status}</td></tr>`
      );
    });
    let html = `
    <table style="border:none !important;">
    <tr>
    <th style="border:none !important; text-align:left;">Description</th>
    <th style="border:none !important; text-align:center;">Status</th>
  </tr>
  ${mitigationsList.join('')}
</table>`;
    if (mitigationsList.length) return html; // ;
    else return '';
  }
  filterStatusMitigations(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(mitigation.status);
    });
    return mitigationsList;
  }
}
