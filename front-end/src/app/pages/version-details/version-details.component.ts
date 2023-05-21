import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-version-details',
  templateUrl: './version-details.component.html',
  styleUrls: ['./version-details.component.scss']
})
export class VersionDetailsComponent {
  constructor(public router: Router,
    public activatedRoute: ActivatedRoute,
    private initiativesService:InitiativesService,
    ) {
    
  }
 
  displayedColumns: string[] = ['ID', 'Risk Achieving Impact', 'Risk Category', 'Risk Owner', 'Description Risk', 'Current Likelihood', 'Current Impact', 'Current Risk Level', 'Target Likelihood', 'Target Impact', 'Target Risk Level', 'Mitigation Action', 'Status of Actions', 'Flag to SDG', 'Redundant'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  path: any = '';
  id: any;
 async ngOnInit() {
    this.path = window.location.pathname
    const params:any =  this.activatedRoute.snapshot.params
    this.id = params.versionId
  const  initiative  = await this.initiativesService.getInitiative(this.id)
   this.dataSource.data  = initiative.risks; 
  }

  filterDescriptionMitigations(element: any) {
    const mitigationsList:any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(mitigation.description );
    });
    return mitigationsList.join(', ');
  }
  filterStatusMitigations(element: any) {
    const mitigationsList:any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(mitigation.status);
    });
    return mitigationsList;
  }
}
