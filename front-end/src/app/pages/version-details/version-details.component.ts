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
  dataSource = new MatTableDataSource<any>([
    { 
      "ID": "1.001", 
      "Risk Achieving Impact": "Operational: Data Impedance (1)", 
      "Risk Category": "Partners and partnerships", 
      "Risk Owner": "Monther", 
      "Description Risk": "Efforts and time taken to generate large amounts of market intelligence data paralyzes the product profile revision process; programs continue to pursue inadequately targeted priorities", 
      "Current Likelihood": "2", 
      "Current Impact": "5", 
      "Current Risk Level": "10", 
      "Target Likelihood": "4", 
      "Target Impact": "3", 
      "Target Risk Level": "12",
      "Mitigation Action": "Active collaboration with Market Intelligence to work towards pragmatic approaches, including (i) ABI-supported collection of current status across breeding programs; (ii) agreement over main impact hypotheses; (iii) use of DAC indicators",
      "Status of Actions": "Delayed",
      "Flag to SDG": "",
      "Redundant": "",
    },
    { 
      "ID": "1.001", 
      "Risk Achieving Impact": "Operational: Data Impedance (1)", 
      "Risk Category": "Partners and partnerships", 
      "Risk Owner": "Monther", 
      "Description Risk": "Efforts and time taken to generate large amounts of market intelligence data paralyzes the product profile revision process; programs continue to pursue inadequately targeted priorities", 
      "Current Likelihood": "2", 
      "Current Impact": "5", 
      "Current Risk Level": "10", 
      "Target Likelihood": "4", 
      "Target Impact": "3", 
      "Target Risk Level": "12",
      "Mitigation Action": "Active collaboration with Market Intelligence to work towards pragmatic approaches, including (i) ABI-supported collection of current status across breeding programs; (ii) agreement over main impact hypotheses; (iii) use of DAC indicators",
      "Status of Actions": "Delayed",
      "Flag to SDG": "",
      "Redundant": "",
    },
    { 
      "ID": "1.001", 
      "Risk Achieving Impact": "Operational: Data Impedance (1)", 
      "Risk Category": "Partners and partnerships", 
      "Risk Owner": "Monther", 
      "Description Risk": "Efforts and time taken to generate large amounts of market intelligence data paralyzes the product profile revision process; programs continue to pursue inadequately targeted priorities", 
      "Current Likelihood": "2", 
      "Current Impact": "5", 
      "Current Risk Level": "10", 
      "Target Likelihood": "4", 
      "Target Impact": "3", 
      "Target Risk Level": "12",
      "Mitigation Action": "Active collaboration with Market Intelligence to work towards pragmatic approaches, including (i) ABI-supported collection of current status across breeding programs; (ii) agreement over main impact hypotheses; (iii) use of DAC indicators",
      "Status of Actions": "Delayed",
      "Flag to SDG": "",
      "Redundant": "",
    }
    
  ]);

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
}
