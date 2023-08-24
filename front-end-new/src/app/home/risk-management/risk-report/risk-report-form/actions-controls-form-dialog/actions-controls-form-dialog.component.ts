import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-actions-controls-form-dialog',
  templateUrl: './actions-controls-form-dialog.component.html',
  styleUrls: ['./actions-controls-form-dialog.component.scss'],
})
export class ActionsControlsFormDialogComponent {
  constructor(
    
    private dialogRef: MatDialogRef<ActionsControlsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public actionsControlsData: { title: any; element: any }
  ) {}

  actionsControlsFormData = new FormGroup({
    description: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onAddMitigation() {}

  

  onUpdateMitigation() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
