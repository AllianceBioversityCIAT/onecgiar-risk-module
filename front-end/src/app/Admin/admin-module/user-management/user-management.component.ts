import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/header.service';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private users: UserService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  dataSource: any = [];
  data: any;
  filters: any = null;
  userTable: boolean = true;
  length!: number;
  pageSize: number = 5;
  pageIndex: number = 1;
  filterForm: FormGroup = new FormGroup({});

  sort = [
    { name: 'ID (ASC)', value: 'id,ASC' },
    { name: 'ID (DESC)', value: 'id,DESC' },
    { name: 'Name (ASC)', value: 'full_name,ASC' },
    { name: 'Name (DESC)', value: 'full_name,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.filters = this.filterForm.value;
      this.init();
    });
  }

  async ngOnInit() {
    this.filterForm = this.fb.group({
      email: [null],
      role: [null],
      sort: [null],
    });
    await this.init();
    this.setForm();

    this.title.setTitle('User management');
    this.meta.updateTag({ name: 'description', content: 'User management' });
  }
  async init() {
    this.data = await this.users.getUsers(
      this.filters,
      this.pageIndex,
      this.pageSize
    );
    this.dataSource = this.data.result;
    this.length = this.data.count;
  }
  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.data = await this.users.getUsers(
      this.filters,
      this.pageIndex,
      this.pageSize
    );
    this.dataSource = this.data.result;
  }

  

  displayedColumns: string[] = ['id', 'full_name', 'email', 'role', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialogAddUser(title: any, element: any = null) {
    this.dialog
      .open(UserFormDialogComponent, {
        width: '68rem',
        height: '57.4rem',
        data: {
          title: title,
          element: element,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        await this.init();
      });
  }

  openDialogEditUser(title: any, element: any) {
    this.dialog
      .open(UserFormDialogComponent, {
        width: '68rem',
        height: '57.4rem',
        data: {
          title: title,
          element: element,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        await this.init();
      });
  }

  //Delete-User-By-Id

  async deleteUserById(id: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          const result = await this.users.deleteUser(id);
          if (result) {
            this.toastr.success('Success deleted');
          } else {
            this.toastr.error('can not deleted');
          }
        }
        await this.init();
      });
  }

  async export() {
    await this.users.exportUsers();
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
