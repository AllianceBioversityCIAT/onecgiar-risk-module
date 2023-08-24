import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
})
export class UserFormDialogComponent implements OnInit {
  constructor(
    private apiUser: ApiUserService,
    private users: UserService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: { title: any; element: any }
  ) {}

  userFormData = new FormGroup({

    id: new FormControl(this.userData?.element?.id || null),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required,Validators.email]),
    role: new FormControl('', [Validators.required]),
  });



  

  ngOnInit(): void {
    this.setValue();
  }

  async onSubmit() {
    //Add
    if(this.userData.element == null) {
      if (this.userFormData.valid) {
        await this.users.addUser(this.userFormData.value);
        this.onCloseDialog();
        this.toastr.success('Added successfully');
      }
    }
    //edit
    else {
      if (this.userFormData.valid) {
        await this.users.updateUser(this.userFormData.value)
        this.onCloseDialog();
        this.toastr.success('Updated successfully');
      }
    }
  }


  async setValue() {
    if(this.userData.element != null){
        this.userFormData.patchValue({
          email: this.userData.element.email,
          role: this.userData.element.role,
          first_name: this.userData.element.first_name,
          last_name: this.userData.element.last_name,
        });
    }
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
