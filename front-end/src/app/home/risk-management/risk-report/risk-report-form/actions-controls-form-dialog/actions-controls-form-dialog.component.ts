import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { WordCountValidators } from 'src/app/validators/word-count.validator';


@Component({
  selector: 'app-actions-controls-form-dialog',
  templateUrl: './actions-controls-form-dialog.component.html',
  styleUrls: ['./actions-controls-form-dialog.component.scss'],
})
export class ActionsControlsFormDialogComponent {
  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActionsControlsFormDialogComponent>,
    private mitigationService: MitigationStatusService,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  Actions: any;

  proposedForm: any;
  populateProposedForm() {
    this.proposedForm = this.fb.group({
      description: [this.data?.proposed?.description, [Validators.required, WordCountValidators.max(150)]],
      mitigation_status_id: [this.data?.proposed?.mitigation_status_id, Validators.required],
    });
  }


  submit() {
    this.proposedForm.markAllAsTouched();
    this.proposedForm.updateValueAndValidity();
    if (this.proposedForm.valid) {
      if (this.data.role == 'add') {
        this.dialogRef.close({
          role: this.data.role,
          formValue: this.proposedForm.value,
        });
      } else {
        this.dialogRef.close({
          role: this.data.role,
          formValue: this.proposedForm.value,
          index: this.data.index,
        });
      }
    }
  }








  ngOnInit() {
    this.populateProposedForm();
    this.getMitigationAction();
  }
  async getMitigationAction(){
    this.Actions = await this.mitigationService.getMitigationStatus(null,null,null)
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
