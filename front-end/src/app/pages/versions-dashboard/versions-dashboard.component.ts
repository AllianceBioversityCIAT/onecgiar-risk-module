import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-versions-dashboard',
  templateUrl: './versions-dashboard.component.html',
  styleUrls: ['./versions-dashboard.component.scss']
})
export class VersionsDashboardComponent {
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
    ) {
    
  }

  

  


  displayedColumns: string[] = ['Version', 'Version Title', 'Publish Reason', 'Creation Date', 'Creation By', 'Actions'];
  dataSource = new MatTableDataSource<any>([
    { 
      "Version": "1", 
      "Version Title": "Test", 
      "Publish Reason": "Test", 
      "Creation Date": "Test",
      "Creation By": "Test"
    }
  ]);

  openNewMemberDialog() {

  }
  @ViewChild(MatPaginator) paginator: any;

  path: any = '';
  initiativeId: any;
  ngOnInit() {
    this.path = window.location.pathname
    this.activatedRoute.queryParams.subscribe(params => {
      this.initiativeId = Number(params['initiativeId']);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
