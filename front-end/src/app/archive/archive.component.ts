import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HeaderService } from '../header.service';
import { UserService } from '../services/user.service';
import { InitiativesService } from '../services/initiatives.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit{
  
  length = 100;
  activePhaseSelected: boolean = true;
  userRole: any;
  user_info: any;
  loading = true;
  isadmin = false;
  displayedColumns: string[] = [
    'INIT-ID',
    'Initiative Name',
    'Risk Category',
    'Number of risks',
    'My Role',
    'status',
    'Actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    public router: Router,
    public initiativeService: InitiativesService,
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    public headerService: HeaderService,
  ) {
    this.title.setTitle('Archive');
  }

  ngOnInit(): void {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.userRole = jwt_decode(access_token);
    }
    if (this.userRole.role == 'admin') {
      this.displayedColumns.splice(
        this.displayedColumns.length - 1,
        0,
        'Help requested'
      );
    }
    this.getInitiatives(this.filters);
  }


  isActiveSelected(element: any) {
    this.activePhaseSelected = element;
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
}
