import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private apiUser: ApiUserService,
    private dialog: MatDialog,
    private headerService: HeaderService
  ) {
    // this.headerService.background = 'green';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = [
    'color',
    'userId',
    'userName',
    'email',
    'role',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(this.apiUser.userData);

  openDialogAddUser(title: any) {
    this.dialog.open(UserFormDialogComponent, {
      width: '68rem',
      height: '49.4rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditUser(title: any, element: any) {
    this.dialog.open(UserFormDialogComponent, {
      width: '68rem',
      height: '49.4rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  //Delete-User-By-Id

  deleteUserById(id: any) {
    this.apiUser
      .openDialogDeleteUser('Are you sure to delete this record ?')
      .afterClosed();
  }
}
