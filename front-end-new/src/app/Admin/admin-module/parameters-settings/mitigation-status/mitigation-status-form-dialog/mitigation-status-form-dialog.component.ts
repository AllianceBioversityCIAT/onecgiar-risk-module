import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
@Component({
  selector: 'app-mitigation-status-form-dialog',
  templateUrl: './mitigation-status-form-dialog.component.html',
  styleUrls: ['./mitigation-status-form-dialog.component.scss'],
})
export class MitigationStatusFormDialogComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MitigationStatusFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mitigationData: any,
    private toster: ToastrService,
    private mitigationStatusService: MitigationStatusService,

  ) {}

  mitigationForm = this.fb.group({
    id:this.fb.control(this.mitigationData?.element?.id || null),
    title:this.fb.control(this.mitigationData?.element?.title || null,Validators.required),
    description:this.fb.control(this.mitigationData?.element?.description || null, [Validators.required]),
  });

  ngOnInit(): void {
  }

  async onSubmit() {
    const id = this.mitigationForm.getRawValue().id;
    if(this.mitigationData.action == 'Edit mitigation'){
      if(this.mitigationForm.valid){
        await this.mitigationStatusService.updateMitigationStatus(id ,this.mitigationForm.value);
          this.onCloseDialog();
          this.toster.success('updated successfully');
      }
    }
    else{
      if(this.mitigationForm.valid){
        await this.mitigationStatusService.addMitigationStatus(this.mitigationForm.value);
          this.toster.success('Added successfully');
          this.onCloseDialog();
      }
    }
  }


  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
