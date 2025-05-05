import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-dialog.component.ts',
  templateUrl: './project-dialog.component.ts.component.html',
  styleUrls: ['./project-dialog.component.ts.component.scss'],
})
export class ProjectDialogComponentTsComponent {
  form = this.fb.group({
    official_code: ['', Validators.required],
    name: ['', Validators.required],
    isProject: [false], // checkbox
  });

  constructor(
    private fb: FormBuilder,
    private svc: ProjectsService,
    public ref: MatDialogRef<ProjectDialogComponentTsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.form.patchValue(data);
  }

  async save() {
    if (this.form.invalid) return;
    const body = {
      ...this.form.value,
      isProject: this.form.value.isProject ? 1 : 0,
    };
    this.data
      ? await this.svc.update(this.data.id, body)
      : await this.svc.create(body);
    this.ref.close(true);
  }
}
