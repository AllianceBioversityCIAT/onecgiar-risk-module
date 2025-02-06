import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss']
})
export class OrganizationDialogComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private organizationService: OrganizationService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    console.log(this.data)
  }
  organizationForm!: FormGroup;

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.organizationForm = this.fb.group({
      name: [this.data.item?.name, Validators.required],
      acronym: [this.data.item?.acronym, Validators.required],
      code: [this.data.item?.code, Validators.required],
    });
  }


  async submit() {
    this.organizationForm.markAllAsTouched();
    this.organizationForm.updateValueAndValidity();
    if (this.organizationForm.valid) {
      await this.organizationService
        .submitOrganization(this.data.item?.code, this.organizationForm.value)
        .then(
          (data) => {
            if (!this.data.item?.code)
              this.toast.success("Organization added successfully");
            else this.toast.success("Organization updated successfully");

            this.dialogRef.close({ submitted: true });
          },
          (error) => {
            this.toast.error(error.error.message);
          }
        );
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
