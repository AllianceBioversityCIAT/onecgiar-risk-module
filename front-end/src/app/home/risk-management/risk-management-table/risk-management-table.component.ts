import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationEnd } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { MatPaginator } from '@angular/material/paginator';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription, delay, interval } from 'rxjs';
import { HeaderService } from 'src/app/header.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-risk-management-table',
  templateUrl: './risk-management-table.component.html',
  styleUrls: ['./risk-management-table.component.scss'],
})
export class RiskManagementTableComponent {
  public url1: string = '';

  public riskUrl = {
    riskManagement: '/home/risk-management',
  };

  navigationSubscription;
  constructor(
    public router: Router,
    public initiativeService: InitiativesService,
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    public headerService: HeaderService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getInitiatives();
      }
    });
    this.title.setTitle('Risk management');
    this.meta.updateTag({
      name: 'description',
      content: 'Risk management',
    });
  }
  length = 100;

  userRole: any;
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
  filter(filters: any) {
    this.getInitiatives(filters);
  }
  async getInitiatives(filters = null) {
    if (filters)
      var Initiatives: any =
        await this.initiativeService.getInitiativesWithFilters(filters);
    else var Initiatives: any = await this.initiativeService.getInitiatives();

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

  // loadContent() {
  //   this.loading = true;
  //   const subs$: Subscription = interval(50).subscribe((res) => {
  //     this.value = this.value + 10;
  //     if (this.value === 120) {
  //       subs$.unsubscribe();
  //       this.loading = false;
  //       this.value = 0;
  //       console.log('Ha terminado');
  //     }
  //   });
  // }

  user_info: any;
  loading = true;
  isadmin = false;
  async ngOnInit() {
    // this.router.events.subscribe((e) => {
    //   if (this.headerService.background == '#04030f') this.isadmin = true;
    //   else this.isadmin = false;
    //   this.user_info = this.authService.getLogedInUser();
    // });
    // this.loadingService.loadingSub.pipe(delay(0)).subscribe((d) => {
    //   if (this.headerService.background == '#04030f') this.isadmin = true;
    //   else this.isadmin = false;
    //   this.loading = d;
    // });

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
    this.getInitiatives();
    // this.url1 = this.router.url;
  }
}
