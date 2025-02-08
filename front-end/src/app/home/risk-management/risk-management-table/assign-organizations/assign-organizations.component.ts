import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from 'src/app/services/organization.service';
import { PhasesService } from 'src/app/services/phases.service';

@Component({
  selector: 'app-assign-organizations',
  templateUrl: './assign-organizations.component.html',
  styleUrls: ['./assign-organizations.component.scss']
})
export class AssignOrganizationsComponent implements OnInit{
  programId!: number;
  assignOrgsForm!: FormGroup;
  organizations: any = [];
  phaseId!: number;
  constructor(
    private dialogRef: MatDialogRef<AssignOrganizationsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private toast: ToastrService,
    private fb: FormBuilder,
    private organizationsService: OrganizationService,

  ) {
    this.programId = this.data.programId;
    this.phaseId = this.data.phase.id;
  }

  ngOnInit(): void {
    this.formInit()
  }

  private async formInit() {
    this.assignOrgsForm = this.fb.group({
      organizations: [[], Validators.required],
    });

    this.organizations = await this.organizationsService.getOrganizations(null, 1, 1000);

    let AssignedOrganizations: any = await this.organizationsService.getOrganizationsByProgramId(
      this.programId,
      this.phaseId
    );

    let AssignedOrganizationsCodes = AssignedOrganizations.map((organization: any) => organization.code);
    
    

      this.assignOrgsForm.setValue({
        organizations: AssignedOrganizationsCodes,
      });
  }


  async submit() {
    if (this.assignOrgsForm.valid) {
      const organizations = this.assignOrgsForm.value.organizations;

      const data = {
        program_id: this.programId,
        phase_id: this.phaseId,
        organizations: organizations,
      };

      await this.organizationsService.assignOrgs(data).then(
        (data) => {
          if(data)
            this.toast.success("Organizations assigned successfully");
            this.dialogRef.close();
        }
      )
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
