import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiMitigationStatusService } from 'src/app/shared-services/admin-services/Parameters-settings-Services/api-mitigation-status.service';
@Component({
  selector: 'app-mitigation-status-form-dialog',
  templateUrl: './mitigation-status-form-dialog.component.html',
  styleUrls: ['./mitigation-status-form-dialog.component.scss'],
})
export class MitigationStatusFormDialogComponent implements OnInit {
  constructor(
    private apiMitigationStatus: ApiMitigationStatusService,
    private dialogRef: MatDialogRef<MitigationStatusFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mitigationData: { title: any; element: any }
  ) {}

  mitigationFormData = new FormGroup({
    mitigationName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryGroup: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onAddMitigation() {}

  onUpdateMitigation() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
