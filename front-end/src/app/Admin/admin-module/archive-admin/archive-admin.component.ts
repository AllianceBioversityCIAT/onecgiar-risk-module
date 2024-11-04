import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from 'src/app/header.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-archive-admin',
  templateUrl: './archive-admin.component.html',
  styleUrls: ['./archive-admin.component.scss']
})
export class ArchiveAdminComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public initiativeService: InitiativesService,
    private userService: UserService,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }
  length = 100;
  user_info: any;
  loading = true;
  isadmin = false;
  userRole: any;
  displayedColumns: string[] = [
    'INIT-ID',
    'Initiative Name',
    'Risk Category',
    'Number of risks',
    'My Role',
    'status',
    'Help requested',
    'Actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any;




  async ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.userRole = jwt_decode(access_token);
    }
    this.getInitiatives(this.filters);

    this.title.setTitle('Archive module');
    this.meta.updateTag({ name: 'description', content: 'Archive module' });
  }

  filters: any = {};
  filter(filters: any) {
    this.filters = filters
    this.getInitiatives(filters);
  }
  async getInitiatives(filters = null) {
    let Initiatives: any = await this.initiativeService.getInitiativesWithFilters(filters);
    this.dataSource = new MatTableDataSource<any>(Initiatives);
    this.length = Initiatives.length;
  }

  listOfCategories: any[] = [];
  filterCategories(categories: any) {
    this.listOfCategories = [];
    for (let item of categories) {
      this.listOfCategories.push(item?.category?.title);
    }
    const result = this.listOfCategories
      .filter((item, index) => this.listOfCategories.indexOf(item) === index)
      .join(', ');
    return result;
  }


  filterRoles(roles: any) {
    const user_info = this.userService.getLogedInUser();
    var list = '';

    list = roles
      .filter((d: any) => d.user_id == user_info.id)
      .map((d: any) => d.role)
      .join(', ');
    if (list == '') list = 'Guest';
    return list;
  }

  filterReqAssistance(risk: any) {
    let column = '-';
    for (let item of risk) {
      if (item.request_assistance == true) {
        column = 'Yes';
        break;
      } else {
        column = 'No';
      }
    }
    return column;
  }


  syncData() {

  }
}
