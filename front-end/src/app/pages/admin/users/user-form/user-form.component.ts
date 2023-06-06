import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: any;
  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.userForm = this.fb.group({
      first_name: [this.data?.item?.first_name || null, Validators.required],
      last_name: [this.data?.item?.last_name || null, Validators.required],
      role: [this.data?.item?.role || null, Validators.required],
      email: [
        this.data?.item?.email || null,
        [Validators.required, Validators.email],
      ],
      id: [this.data?.item?.id || null],
    });
  }
  onConfirm(): void {
    // Close the dialog, return true
    if (this.userForm.valid) this.dialogRef.close(this.userForm.value);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
