import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss'],
})
export class RiskManagementComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#0f212f';
    this.headerService.backgroundNavMain = '#436280';
    this.headerService.backgroundUserNavButton = '#436280';
  }

  ngOnInit() {
    this.title.setTitle('Risk management');
    this.meta.updateTag({ name: 'description', content: 'Risk management' });
  }

  // public url1: string = '';

  // public riskUrl = {
  //   riskManagement: '/home/risk-management',
  // };

  // navigationSubscription;
  // constructor(
  //   public router: Router,
  //   public initiativeService: InitiativesService,
  //   private userService: UserService
  // ) {
  //   this.navigationSubscription = this.router.events.subscribe((e: any) => {
  //     // If it is a NavigationEnd event re-initalise the component
  //     if (e instanceof NavigationEnd) {
  //       this.getInitiatives();
  //     }
  //   });
  // }
  // length = 100;

  // userRole: any;
  // displayedColumns: string[] = [
  //   'INIT-ID',
  //   'Initiative Name',
  //   'Risk Category',
  //   'Number of risks',
  //   'My Role',
  //   'status',
  //   'Actions',
  // ];
  // dataSource = new MatTableDataSource<any>([]);
  // @ViewChild(MatPaginator) paginator: any;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.getInitiatives();
  // }
  // filter(filters:any){
  //   this.getInitiatives(filters)
  // }
  // async getInitiatives(filters = null) {
  //   if(filters)
  //   var Initiatives: any = await this.initiativeService.getInitiativesWithFilters(filters);
  //   else
  //   var Initiatives: any = await this.initiativeService.getInitiatives();

  //   this.dataSource = new MatTableDataSource<any>(Initiatives);
  //   this.length = Initiatives.length;

  //   // this.pageSize =  this.dataSource.meta.itemsPerPage;
  //   // this.totalItems =  this.dataSource.meta.totalItems;
  // }
  // ngOnDestroy() {
  //   if (this.navigationSubscription) {
  //     this.navigationSubscription.unsubscribe();
  //   }
  // }
  // listOfCategories: any[] = [];
  // filterCategories(categories: any) {
  //   this.listOfCategories = [];
  //   for(let item of categories)
  //   {
  //     this.listOfCategories.push(item?.category?.title)
  //   }
  //   const result =  this.listOfCategories.filter((item, index) => this.listOfCategories.indexOf(item) === index).join(', ');
  //   return result;
  // }

  // filterRoles(roles: any) {
  //   const user_info = this.userService.getLogedInUser();
  //   var list = '';

  //   list = roles
  //     .filter((d: any) => d.user_id == user_info.id)
  //     .map((d: any) => d.role)
  //     .join(', ');
  //   if (list == '') list = 'Guest';
  //   return list;
  // }
  // filterReqAssistance(risk: any) {
  //   let column = '-';
  //   for(let item of risk) {
  //     if(item.request_assistance == true) {
  //       column = 'Yes';
  //       break;
  //     }
  //     else {
  //       column = 'No'
  //     }
  //   }
  //   return column;
  // }
  // async ngOnInit() {
  //   const access_token = localStorage.getItem('access_token');
  //   if (access_token) {
  //     this.userRole = jwt_decode(access_token);
  //   }
  //   if(this.userRole.role == 'admin') {
  //     this.displayedColumns.splice(this.displayedColumns.length - 1, 0, "Help requested");
  //   }
  //   this.getInitiatives();
  //   // this.url1 = this.router.url;
  // }
}
