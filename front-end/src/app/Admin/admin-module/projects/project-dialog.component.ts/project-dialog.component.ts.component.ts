import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-dialog.component.ts',
  templateUrl: './project-dialog.component.ts.component.html',
  styleUrls: ['./project-dialog.component.ts.component.scss'],
})
export class ProjectDialogComponentTsComponent {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private svc: ProjectsService,
    private dialogRef: MatDialogRef<ProjectDialogComponentTsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { program: any }
  ) {
    this.form = fb.group({
      official_code: [data.program?.official_code || '', Validators.required],
      name: [data.program?.name || '', Validators.required],
      isProject: [data.program?.isProject === 1],
    });
  }

  async save() {
    if (this.form.invalid) return;
    const vals = {
      ...this.form.value,
      isProject: this.form.value.isProject ? 1 : 0,
    };
    if (this.data.program) {
      await this.svc.update(this.data.program.id, vals);
    } else {
      await this.svc.create(vals);
    }
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
