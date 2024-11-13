import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from 'src/app/header.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-sync-clarisa',
  templateUrl: './sync-clarisa.component.html',
  styleUrls: ['./sync-clarisa.component.scss']
})
export class SyncClarisaComponent {
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
  initIds: number[] = [];


  async ngOnInit() {
    this.getInitiatives(this.filters);

    this.title.setTitle('Sync clarisa');
    this.meta.updateTag({ name: 'description', content: 'Sync clarisa' });
  }


  filters: any = { archived: false };

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

  checkInit(event: MatCheckboxChange, id: number) {
    if(event.checked) {
      this.initIds.push(id);
    } else {
      const indexId = this.initIds.indexOf(id);
      if (indexId !== -1) {
        this.initIds.splice(indexId, 1);
      }
    }
  }


  async syncData() {
    if(this.initIds.length) {
      this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: `Are you sure you want to sync this program`,
          svg: '../../../assets/shared-image/sync.png'
        },
      })
      .afterClosed().subscribe(async res => {
        if(res){
          await this.initiativeService.syncInit(this.initIds).then(
            () => {
              this.getInitiatives(this.filters);
              this.toastr.success('Sync successfully');
            }, (error) => {
              this.toastr.error(error.error.message);
            }
          );
        }
      });
    } else {
      this.toastr.error('please select programs you want to sync it');
    }
  }
}
