import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-version-details',
  templateUrl: './version-details.component.html',
  styleUrls: ['./version-details.component.scss']
})
export class VersionDetailsComponent {
  constructor(public router: Router,
    public activatedRoute: ActivatedRoute
    ) {
    
  }
 

 



  displayedColumns: string[] = ['ID', 'Risk Achieving Impact', 'Risk Category', 'Risk Owner', 'Description Risk', 'Target Likelihood', 'Target Impact', 'Target Risk Level', 'Likelihood', 'Impact', 'Risk Score',  'Mitigation Action', 'Status of Actions', 'Flag to SDG',];
  dataSource = new MatTableDataSource<any>([
    { 
      "ID": "1.001", 
      "Risk Achieving Impact": "Operational: Data Impedance (1)", 
      "Risk Category": "Partners and partnerships", 
      "Risk Owner": "Monther", 
      "Description Risk": "Efforts and time taken to generate large amounts of market intelligence data paralyzes the product profile revision process; programs continue to pursue inadequately targeted priorities", 
      "Target Likelihood": "2", 
      "Target Impact": "5", 
      "Target Risk Level": "10", 
      "Likelihood": "4", 
      "Impact": "3", 
      "Risk Score": "12",
      "Mitigation Action": "Active collaboration with Market Intelligence to work towards pragmatic approaches, including (i) ABI-supported collection of current status across breeding programs; (ii) agreement over main impact hypotheses; (iii) use of DAC indicators",
      "Status of Actions": "Delayed",
      "Flag to SDG": "",
    },
    { 
      "ID": "1.001", 
      "Risk Achieving Impact": "Operational: Data Impedance (1)", 
      "Risk Category": "Partners and partnerships", 
      "Risk Owner": "Monther", 
      "Description Risk": "Efforts and time taken to generate large amounts of market intelligence data paralyzes the product profile revision process; programs continue to pursue inadequately targeted priorities", 
      "Target Likelihood": "2", 
      "Target Impact": "5", 
      "Target Risk Level": "10", 
      "Likelihood": "4", 
      "Impact": "3", 
      "Risk Score": "12",
      "Mitigation Action": "Active collaboration with Market Intelligence to work towards pragmatic approaches, including (i) ABI-supported collection of current status across breeding programs; (ii) agreement over main impact hypotheses; (iii) use of DAC indicators",
      "Status of Actions": "Delayed",
      "Flag to SDG": "",
    },
   

    
  ]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  path: any = '';
  id: any;
  ngOnInit() {
    this.path = window.location.pathname

    this.activatedRoute.params.subscribe(params=>{
      this.id = params['versionId'];
    })
  }
}
