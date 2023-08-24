import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/header.service';
import { UserService } from 'src/app/services/user.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    // private apiUser: ApiUserService,
    private users: UserService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private toastr: ToastrService
  ) {
  }


  dataSource: any = [];
  data:any;
  filters: any = null;
  userTable: boolean = true;
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  async ngOnInit() {
    await this.init();
    await this.applysort();
  }
  async init() {
    this.data = await this.users.getUsers(this.filters, this.pageIndex, this.pageSize);
    this.dataSource = this.data.result;
    this.length = this.data.count;
  }
  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.data = await this.users.getUsers(this.filters,this.pageIndex,this.pageSize);
    this.dataSource = this.data.result;
  }

  async applysort() {
    this.sort.sortChange.subscribe(async res =>{
      let finalSort = `${res.active},${res.direction}`;
      this.filters = {...this.filters ,sort: finalSort};
      await this.init();
    })
  }

  // async filter(filters: any) {
  //   this.filters = filters;
  //   await this.init();
  // }



  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filters = {...this.filters ,searchValue: filterValue};
    await this.init();
  }

  displayedColumns: string[] = [
    'color',
    'id',
    'full_name',
    'email',
    'role',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  openDialogAddUser(title: any, element: any = null) {
    this.dialog.open(UserFormDialogComponent, {
      width: '68rem',
      height: '49.4rem',
      data:  {
        title: title,
        element: element,
      },
    }).afterClosed().subscribe(async res => {
        await this.init();
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
    }).afterClosed().subscribe(async res => {
      await this.init();
    });
  }

  //Delete-User-By-Id

  async deleteUserById(id: any) {

    this.dialog
    .open(DeleteConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        message : 'Are you sure you want to delete this record ?'
      }
    }).afterClosed()
    .subscribe(async (res) => {
      if(res == true) {
        const result =  await this.users.deleteUser(id);
        if(result) {
          this.toastr.success(
            'Success deleted'
          );
        }
        else {
          this.toastr.error(
            'can not deleted'
          );
        }
      }
      await this.init();
    });
  }

  async export() {
    await this.users.exportUsers();
  }
}

