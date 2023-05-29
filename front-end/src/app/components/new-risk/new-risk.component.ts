import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RiskService } from 'src/app/services/risk.service';
import { WordCountValidators } from 'src/app/validators/word-count.validator';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../confirm/confirm.component';
import { NewProposedComponent } from '../new-proposed/new-proposed.component';

@Component({
  selector: 'app-new-risk',
  templateUrl: './new-risk.component.html',
  styleUrls: ['./new-risk.component.scss'],
})
export class NewRiskComponent {
  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewRiskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private riskService: RiskService,
    private toastr: ToastrService
  ) {}

  riskApi: any = null;

  errorMessage: any = '';
  riskCategories: any;
  newRiskForm: any;

  populateNewRiskForm() {
    this.newRiskForm = this.fb.group({
      risk_owner: [this?.data?.risk?.risk_owner, Validators.required],
      category_id: [this?.data?.risk?.category.id, Validators.required],
      title: [this?.data?.risk?.title,[ Validators.required, WordCountValidators.max(50)]],
      description: [this?.data?.risk?.description, [Validators.required, WordCountValidators.max(150)]],
      target_likelihood: [
        String(this?.data?.risk?.target_likelihood | 0),
        Validators.required,
      ],
      target_impact: [
        String(this?.data?.risk?.target_impact | 0),
        Validators.required,
      ],
      current_likelihood: [
        String(this?.data?.risk?.current_likelihood | 0),
        Validators.required,
      ],
      current_impact: [
        String(this?.data?.risk?.current_impact | 0),
        Validators.required,
      ],
    });

    if (this?.data?.risk?.mitigations) {
      this.proposed = new MatTableDataSource<any>(
        this?.data?.risk?.mitigations
      );
    }
  }

  async submit() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    let result = null;
    if (this.newRiskForm.valid) {
      this.errorMessage = '';
      if (this?.data?.risk?.id) {
        result = await this.riskService.updateRisk(this?.data?.risk?.id, {
          id: Number(this?.data?.risk?.id),
          initiative_id:
            +this?.data?.risk?.initiative_id | this?.data?.initiative_id,
          mitigations: this.proposed.data,
          ...this.newRiskForm.value,
        });
        console.log(result);
        if (result)
          this.toastr.success(
            'Success',
            `${this.newRiskForm.value.title} has been updated`
          );
      } else {
        result = await this.riskService.createNewRisk({
          initiative_id: this?.data?.initiative_id,
          mitigations: this.proposed.data,
          ...this.newRiskForm.value,
        });
        if (result)
          this.toastr.success(
            'Success',
            `${this.newRiskForm.value.title} has been created`
          );
      }

      this.dialog.closeAll();
    }
  }

  arr: any[] = [];
  async openNewProposedDialog() {
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
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
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Delete',
          `Are you sure you want to delete Mitigation ?`
        ),
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
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
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

  async ngOnInit() {
    this.populateNewRiskForm();
    this.riskCategories = await this.riskService.getRiskCategories();
  }
}
