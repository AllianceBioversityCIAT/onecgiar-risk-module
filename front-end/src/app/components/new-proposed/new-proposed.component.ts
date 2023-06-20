import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { WordCountValidators } from 'src/app/validators/word-count.validator';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
@Component({
  selector: 'app-new-proposed',
  templateUrl: './new-proposed.component.html',
  styleUrls: ['./new-proposed.component.scss'],
})
export class NewProposedComponent {
  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewProposedComponent>,
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
    this.Actions = await this.mitigationService.getMitigation()
  }
}
