import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
})
export class UserFormDialogComponent implements OnInit {
  constructor(
    private apiUser: ApiUserService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: { title: any; element: any }
  ) {}

  userFormData = new FormGroup({
    email: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onAddUser() {}

  onUpdateUser() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
