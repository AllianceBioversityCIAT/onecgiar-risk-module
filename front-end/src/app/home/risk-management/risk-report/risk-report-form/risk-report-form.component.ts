import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiActionsControlsService } from 'src/app/shared-services/actions-controls-services/api-actions-controls.service';
import { ActionsControlsFormDialogComponent } from './actions-controls-form-dialog/actions-controls-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { RiskService } from 'src/app/services/risk.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { ROLES } from '../team-members/team-members.component';
import { WordCountValidators } from 'src/app/validators/word-count.validator';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { RiskReportComponent } from '../risk-report.component';
import { AppSocket } from 'src/app/services/socket.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-report-form',
  templateUrl: './risk-report-form.component.html',
  styleUrls: ['./risk-report-form.component.scss'],
})
export class RiskReportFormComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  constructor(
    private dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private riskService: RiskService,
    private initiativeService: InitiativesService,
    private router: Router,
    public fb: FormBuilder,
    private mitigationService: MitigationStatusService,
    private toastr: ToastrService,
    public RiskReportcomponent: RiskReportComponent,
    private socket: AppSocket,
    private title: Title,
    private meta: Meta
  ) {

  }

  riskApi: any = null;

  errorMessage: any = '';
  riskCategories: any;
  riskUsers: any;
  risksForUser: any;
  my_roles: any;
  newRiskForm: any;
  user_info: any;
  riskId!: number;
  initiative: any = null;
  initiativeId: any;
  //for teamMember
  my_risks: any;
  leader_corleader_risks: any;
  officalCode: any;
  checkIfRiskExist: any;

  populateNewRiskForm() {
    if (this.riskId) this.socket.emit('risk-lock', this.riskId);
    this.newRiskForm = this.fb.group({
      risk_raiser: [this.user_info.email],
      risk_owner_id: [
        this?.checkIfRiskExist[0]?.risk_owner?.id,
        Validators.required,
      ],
      category_id: [
        this?.checkIfRiskExist[0]?.category.id,
        Validators.required,
      ],
      title: [
        this?.checkIfRiskExist[0]?.title,
        [Validators.required, WordCountValidators.max(50)],
      ],
      description: [
        this?.checkIfRiskExist[0]?.description,
        [Validators.required, WordCountValidators.max(150)],
      ],
      target_likelihood: [
        String(this?.checkIfRiskExist[0]?.target_likelihood || ''),
        Validators.required,
      ],
      target_impact: [
        String(this?.checkIfRiskExist[0]?.target_impact || ''),
        Validators.required,
      ],
      current_likelihood: [
        String(this?.checkIfRiskExist[0]?.current_likelihood || ''),
        Validators.required,
      ],
      current_impact: [
        String(this?.checkIfRiskExist[0]?.current_impact || ''),
        Validators.required,
      ],
      request_assistance: [
        Boolean(this?.checkIfRiskExist[0]?.request_assistance),
        Validators.required,
      ],
      due_date: [
        this?.checkIfRiskExist[0]?.due_date,
        [
          (c: AbstractControl) =>
            new Date(c.value).getTime() < Date.now() && !this?.checkIfRiskExist[0]?.id ? { past_date: true } : null,
            (c: AbstractControl) =>
            new Date(c.value).getTime() <  new Date(this?.checkIfRiskExist[0]?.created_date).getTime() ? { past_date_created: true } : null,
          Validators.required,
        ],
      ],
    });

    if (this?.checkIfRiskExist[0]?.mitigations) {
      this.proposed = new MatTableDataSource<any>(
        this?.checkIfRiskExist[0]?.mitigations
      );
    }
  }

  actions: any;
  async getMitigationActions() {
    this.actions = await this.mitigationService.getMitigationStatus();
  }

  getStatusByID(id: number) {
    return this.actions.filter((d: any) => d.id == id)[0].title;
  }

  async submit() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    let result = null;
    if (this.newRiskForm.valid) {
      this.errorMessage = '';
      if (this.riskId) {
        result = await this.riskService.updateRisk(this.riskId, {
          id: Number(this.riskId),
          initiative_id:
            +this.initiativeId | this?.checkIfRiskExist[0]?.initiative_id,
          mitigations: this.proposed.data,
          ...this.newRiskForm.value,
        });
        console.log(result);
        if (result) {
          this.toastr.success(
            'Success',
            `${this.newRiskForm.value.title} has been updated`
          );
          // to refresh table
          await this.riskService.getRisks(this.riskId, null);
          // this.RiskReportcomponent.loadInitiative();
          setTimeout(() => {
            this.router.navigate([
              `/home/${this.initiativeId}/${this.officalCode}`,
            ]);
          }, 2000);
        }
      } else {
        result = await this.riskService.createNewRisk({
          initiative_id: this.initiativeId,
          mitigations: this.proposed.data,
          ...this.newRiskForm.value,
        });
        if (result) {
          this.toastr.success(
            'Success',
            `${this.newRiskForm.value.title} has been created`
          );
          // to refresh table
          await this.riskService.getRisks(this.riskId, null);
          // this.RiskReportcomponent.loadInitiative();
          setTimeout(() => {
            this.router.navigate([
              `/home/${this.initiativeId}/${this.officalCode}`,
            ]);
          }, 2000);
        }
      }
    }
    else {
      this.toastr.error('Invalid or missing data');
    }
  }

  checkedReqAssistance() {
    if (this.newRiskForm.controls['request_assistance'].value == true) {
      let current_likelihood =
        this.newRiskForm.controls['current_likelihood'].value;
      let current_impact = this.newRiskForm.controls['current_impact'].value;

      this.newRiskForm.controls.target_likelihood.setValue(current_likelihood);
      this.newRiskForm.controls.target_impact.setValue(current_impact);
      this.newRiskForm.get('due_date').clearValidators();
      this.newRiskForm.get('due_date').updateValueAndValidity();
    } else {
      let date: any;
      date = this.newRiskForm.get('due_date');
      date.setValidators([
        (c: AbstractControl) =>
          new Date(c.value).getTime() < Date.now() ? { invalid: true } : null,
        Validators.required,
      ]);
      date.updateValueAndValidity();
    }
  }

  disapledCheckBox() {
    if (this.newRiskForm.controls['request_assistance'].value == true) {
      this.newRiskForm.controls.request_assistance.setValue(false);
    }
  }

  arr: any[] = [];
  async openNewProposedDialog() {
    const dialogRef = this.dialog.open(ActionsControlsFormDialogComponent, {
      width: '68rem',
      height: '43.2rem',
      data: { role: 'add', proposed: null },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const data = this.proposed.data;
        data.push(result.formValue);
        this.proposed = new MatTableDataSource<any>(data);
      }
    });
  }

  async removeProposed(mitigation: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          tiile: 'Delete',
          message: 'Are you sure you want to delete this action ?',
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          let data = this.proposed.data;
          data.splice(data.indexOf(mitigation), 1);
          this.proposed = new MatTableDataSource<any>(data);
        }
      });
  }

  editProposed(mitigation: any) {
    const dialogRef = this.dialog.open(ActionsControlsFormDialogComponent, {
      width: '68rem',
      height: '43.2rem',
      data: { role: 'edit', proposed: mitigation },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result);
      if (result) {
        let data = this.proposed.data;
        data[data.indexOf(mitigation)] = result.formValue;
        this.proposed = new MatTableDataSource<any>(data);
      }
    });
  }

  displayedColumns: string[] = [
    'Mitigation Description',
    'Status of Action',
    'Actions',
  ];
  proposed = new MatTableDataSource<any>([]);

  async ngOnInit(): Promise<void> {
    const childParams: any = this.activatedRoute?.snapshot.params;
    this.riskId = +childParams.riskId;

    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
    }

    const parentParams: any = this.activatedRoute.parent?.params.subscribe(
      (val) => {
        this.initiativeId = +val['id'];
        this.officalCode = val['initiativeId'];
      }
    );

    this.initiative = await this.initiativeService.getInitiative(
      this.initiativeId
    );
    this.leader_corleader_risks = this.initiative?.risks;
    this.checkIfRiskExist = await this.riskService.getRisk(this.riskId);
    this.my_risks = this.initiative.risks
      .filter(
        (d: any) =>
          d?.risk_owner && d?.risk_owner?.user?.id == this.user_info.id
      )
      .map((d: any) => d);

    this.risksForUser = await this.riskService.getRiskUsers(this.initiativeId);
    this.my_roles = this.risksForUser
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);

    //check if user have permission on this risk to update it
    if (this.riskId) {
      if (this.checkIfRiskExist.length > 0) {
        if (this.user_info.role == 'admin') {
          if (this.checkIfRiskExist.length > 0) {
          } else {
            this.router.navigate([
              `/home/${this.initiativeId}/${this.officalCode}`,
            ]);
          }
        } else if (
          this.my_roles?.includes(ROLES.LEAD) ||
          this.my_roles?.includes(ROLES.COORDINATOR)
        ) {
          if (
            this.leader_corleader_risks.filter((e: any) => e.id === this.riskId)
              .length > 0
          ) {
          } else {
            this.router.navigate([
              `/home/${this.initiativeId}/${this.officalCode}`,
            ]);
          }
        } else if (this.my_roles?.includes(ROLES.MEMBER)) {
          if (
            this.my_risks.filter((e: any) => e.id === this.riskId).length > 0
          ) {
          } else {
            this.router.navigate([
              `/home/${this.initiativeId}/${this.officalCode}`,
            ]);
          }
        } else if (this.my_risks.length == 0) {
          this.router.navigate([
            `/home/${this.initiativeId}/${this.officalCode}`,
          ]);
        }
      } else {
        this.router.navigate([
          `/home/${this.initiativeId}/${this.officalCode}`,
        ]);
      }
      this.title.setTitle('Edit risk');
      this.meta.updateTag({
        name: 'description',
        content: 'Edit risk',
      });
    } else {
      this.title.setTitle('Create risk');
      this.meta.updateTag({
        name: 'description',
        content: 'Create risk',
      });
    }

    //dont allow team member to create risk
    let url: any = '';
    url = this.router.url.split('/').at(-1);
    if (
      (this.my_roles?.includes(ROLES.MEMBER) || this.my_risks.length == 0) &&
      url == 'create-risk' &&
      this.user_info.role != 'admin' &&
      !this.my_roles?.includes(ROLES.LEAD) &&
      !this.my_roles?.includes(ROLES.COORDINATOR)
    ) {
      this.router.navigate([`/home/${this.initiativeId}/${this.officalCode}`]);
    }

    this.populateNewRiskForm();
    this.getMitigationActions();
    this.riskCategories = await this.riskService.getRiskCategories();
    if (this.initiativeId) {
      this.riskUsers = await this.riskService.getRiskUsers(this.initiativeId);
    }
  }

  unlock(risk_id: any) {
    this.socket.emit('risk-unlock', risk_id);
  }
  ngOnDestroy(): void {
    this.unlock(this.riskId);
    // this.socket.disconnect();
  }
}
