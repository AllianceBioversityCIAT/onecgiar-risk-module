import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from 'src/app/components/confirm/confirm.component';
import { UserService } from 'src/app/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private users: UserService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  columns = [
    { title: 'ID', name: 'id' },
    { title: 'First Name', name: 'first_name' },
    { title: 'Last Name', name: 'last_name' },
    { title: 'Email', name: 'email' },
    { title: 'Role', name: 'role' },
    { title: 'Full Name', name: 'full_name' },
  ];
  actions = [
    { title: 'Update', action: 'edit', icon: 'edit' },
    { title: 'Delete', action: 'delete', icon: 'delete' },
  ];
  dataSource: any = [];
  filters: any = null;
  async ngOnInit() {
    await this.init();
  }

  async init() {
    this.dataSource = await this.users.getUsers(this.filters);
  }
  add() {
    this.dialog
      .open(UserFormComponent, {
        maxWidth: '400px',
        data: null,
      })
      .afterClosed()
      .subscribe(async (dialogResult: any) => {
        if (dialogResult) {
          await this.users.addUser(dialogResult);
          this.toastr.success('Success', `User has been created`);
          await this.init();
        }
      });
  }
  action(data: any) {
    console.log(data);
    if (data?.act?.action == 'edit')
      this.dialog
        .open(UserFormComponent, {
          maxWidth: '400px',
          data: data,
        })
        .afterClosed()
        .subscribe(async (dialogResult: any) => {
          if (dialogResult) {
            await this.users.updateUser(dialogResult);
            this.toastr.success(
              'Success',
              `${data?.item?.full_name} has been Updated`
            );
            await this.init();
          }
        });
    else if (data?.act?.action == 'delete')
      this.dialog
        .open(ConfirmComponent, {
          maxWidth: '400px',
          data: new ConfirmDialogModel(
            'Delete',
            `Are you sure you want to delete ${data?.item?.full_name}`
          ),
        })
        .afterClosed()
        .subscribe(async (dialogResult) => {
          if (dialogResult) {
            const result = await this.users.deleteUser(data?.item?.id);
            if (result)
              this.toastr.success(
                'Success',
                `${data?.item?.full_name} has been deleted`
              );
            else
              this.toastr.error(
                'Error',
                `${data?.item?.full_name} can't be deleted since it in use`
              );
            await this.init();
          }
        });
  }
  async filter(filters: any) {
    this.filters = filters;
    await this.init();
  }
  async export() {
    await this.users.exportUsers();
  }
}
