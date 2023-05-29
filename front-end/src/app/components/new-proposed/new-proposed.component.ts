import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { WordCountValidators } from 'src/app/validators/word-count.validator';

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
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  Actions: any[] = [
    { value: 'Delayed', viewValue: 'Delayed' },
    { value: 'Completed', viewValue: 'Completed' },
    { value: 'Ongoing and on track', viewValue: 'Ongoing and On Track' },
    { value: 'Unknown/no visibility', viewValue: 'Unknown/No Visibility' },
  ];

  proposedForm: any;
  populateProposedForm() {
    this.proposedForm = this.fb.group({
      description: [this.data?.proposed?.description, [Validators.required, WordCountValidators.max(150)]],
      status: [this.data?.proposed?.status, Validators.required],
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
  }
}
