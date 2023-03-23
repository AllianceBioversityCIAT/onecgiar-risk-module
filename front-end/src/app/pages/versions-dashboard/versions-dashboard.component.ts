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
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "2", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "3", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "4", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "5", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "6", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    },
    { 
      "Version": "7", 
      "Version Title": "My first version", 
      "Publish Reason": "No specific reason", 
      "Creation Date": "5 Nov. 2022",
      "Creation By": "Monther (Co-leader)"
    }
  ]);

  openNewMemberDialog() {

  }
  @ViewChild(MatPaginator) paginator: any;

  path: any = '';
  ngOnInit() {
    this.path = window.location.pathname
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
