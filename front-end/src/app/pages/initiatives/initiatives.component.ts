import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.scss'],
})
export class InitiativesComponent {
  navigationSubscription;
  constructor(
    public router: Router,
    public initiativeService: InitiativesService,
    private userService: UserService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getInitiatives();
      }
    });
  }

  length = 100;
  pageSize = 100;
  pageSizeOptions: number[] = [10, 15, 50, 100];
  totalItems = 0;
  userRole: any;
  pageChanged(event: any) {}
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getInitiatives();
  }
  filter(filters:any){
    this.getInitiatives(filters)
  }
  async getInitiatives(filters = null) {
    if(filters)
    var Initiatives: any = await this.initiativeService.getInitiativesWithFilters(filters);
    else
    var Initiatives: any = await this.initiativeService.getInitiatives();

    this.dataSource = new MatTableDataSource<any>(Initiatives);
    this.length = Initiatives.length;
    // this.pageSize =  this.dataSource.meta.itemsPerPage;
    // this.totalItems =  this.dataSource.meta.totalItems;
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  listOfCategories: any[] = [];
  filterCategories(categories: any) {
    this.listOfCategories = [];
    for(let item of categories)
    {
      this.listOfCategories.push(item?.category?.title)
    }
    const result =  this.listOfCategories.filter((item, index) => this.listOfCategories.indexOf(item) === index).join(', ');
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
    for(let item of risk) {
      if(item.request_assistance == true) {
        column = 'Yes';
        break;
      }
      else {
        column = 'No'
      }
    }
    return column;
  }
  async ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.userRole = jwt_decode(access_token);
    }
    if(this.userRole.role == 'admin') {
      this.displayedColumns.splice(this.displayedColumns.length - 1, 0, "Help requested");
    }
    this.getInitiatives();
  }
}
