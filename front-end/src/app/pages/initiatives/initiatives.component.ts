import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.scss']
})
export class InitiativesComponent {
  constructor(
    public router: Router,
    public initiativeService: InitiativesService
    ) {
    
  }


  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 15, 50, 100];
  totalItems = 0;

  pageChanged(event: any) {}
  displayedColumns: string[] = ['INIT-ID', 'Initiative Name', 'Risk Category', 'Num of Risk', 'My Role', 'Actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async getInitiatives() {
    var Initiatives: any = await this.initiativeService.getInitiatives()
    this.dataSource = new MatTableDataSource<any>(Initiatives)
    // this.length =  this.dataSource.meta.totalItems;
    // this.pageSize =  this.dataSource.meta.itemsPerPage; 
    // this.totalItems =  this.dataSource.meta.totalItems;
  }

  async ngOnInit() {
    this.getInitiatives();
  }
}
