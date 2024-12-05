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
    'Science programs Name',
    'description',
    'active',
    'status',
    'Actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any;
  initIds: number[] = [];


  async ngOnInit() {
    this.getInitiatives();

    this.title.setTitle('Sync clarisa');
    this.meta.updateTag({ name: 'description', content: 'Sync clarisa' });
  }



  async getInitiatives() {
    let sciencePrograms: any = await this.initiativeService.getClarisaPrograms();
    this.dataSource = new MatTableDataSource<any>(sciencePrograms);
    this.length = sciencePrograms.length;
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
              this.getInitiatives();
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
