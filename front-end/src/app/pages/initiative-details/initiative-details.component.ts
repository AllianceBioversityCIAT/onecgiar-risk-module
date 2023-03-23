import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NewRiskComponent } from 'src/app/components/new-risk/new-risk.component';
import { PublishDialogComponent } from 'src/app/components/publish-dialog/publish-dialog.component';

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss']
})
export class InitiativeDetailsComponent {
  constructor(public router: Router,
    public dialog: MatDialog) {
    
  }
 
  editInitiative(data: any) {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: {role: 'edit' , risk: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  deleteInitiative(initiative: any) {
    alert()
    // handel delete initiative api service
  }

  openPublishDialog() {
    this.dialog.open(PublishDialogComponent , {
      width: '600px',
    });
  }

  openNewRiskDialog() {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: {role: 'add'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



  displayedColumns: string[] = ['ID', 'Risk Achieving Impact', 'Risk Category', 'Risk Owner', 'Description Risk', 'Current Likelihood', 'Current Impact', 'Current Risk Level', 'Target Likelihood', 'Target Impact', 'Target Risk Level', 'Mitigation Action', 'Status of Actions', 'Flag to SDG', 'Redundant', 'Actions'];
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
      "Actions": ""
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
      "Actions": ""
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
      "Actions": ""
    }
    
  ]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
