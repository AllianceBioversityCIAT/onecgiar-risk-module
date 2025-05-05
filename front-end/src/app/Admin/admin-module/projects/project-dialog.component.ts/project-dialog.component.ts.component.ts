import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-dialog.component.ts',
  templateUrl: './project-dialog.component.ts.component.html',
  styleUrls: ['./project-dialog.component.ts.component.scss'],
})
export class ProjectDialogComponentTsComponent {
  form = this.fb.group({
    official_code: ['', Validators.required],
    name: ['', Validators.required],
    isProject: [false],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponentTsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data) this.form.patchValue(data);
  }

  save() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
  cancel() {
    this.dialogRef.close();
  }
}
