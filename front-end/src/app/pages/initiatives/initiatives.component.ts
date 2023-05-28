import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { UserService } from 'src/app/services/user.service';

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

  pageChanged(event: any) {}
  displayedColumns: string[] = [
    'INIT-ID',
    'Initiative Name',
    'Risk Category',
    'Number of risks',
    'My Role',
    'Actions',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getInitiatives();
  }

  async getInitiatives() {
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
  async export() {
    await this.initiativeService.getExport();
  }
  filterCategories(categories: any) {
    var list = '';
    list = categories.map((d: any) => d?.category?.title).join(', ');
    return list;
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

  async ngOnInit() {
    this.getInitiatives();
  }
}
