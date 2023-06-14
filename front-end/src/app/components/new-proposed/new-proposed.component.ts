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
    { value: 'Not-started', viewValue: 'Not yet started' , toolTip: ' the action has not started yet but not considered to be delayed. It has not started but this is according to plan'},
    { value: 'Completed', viewValue: 'Completed', toolTip: ' the action has been completed (could be an one-off action taken or the establishment of a control to manage risk i.e. a standing review introduced or a process has been put in place' },
    { value: 'Ongoing and on track', viewValue: 'Ongoing and On Track' , toolTip: 'an action is underway, has not been completed but it is considered to be on track according to schedule'},
    { value: 'Delayed', viewValue: 'Delayed' , toolTip: ' an action is planned or underway, has not been completed but running behind schedule'},
    { value: 'Unknown/no visibility', viewValue: 'Unknown/No Visibility' , toolTip: ' at the point of the review information on action panned is not available. This may be an action owned by another group but an update is missing (i.e. not known if delayed, ongoing and on-track, completed or not yet started)'},
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
