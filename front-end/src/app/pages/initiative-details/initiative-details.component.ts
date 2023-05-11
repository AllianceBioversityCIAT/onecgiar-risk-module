import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NewRiskComponent } from 'src/app/components/new-risk/new-risk.component';
import { PublishDialogComponent } from 'src/app/components/publish-dialog/publish-dialog.component';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-initiative-details',
  templateUrl: './initiative-details.component.html',
  styleUrls: ['./initiative-details.component.scss']
})
export class InitiativeDetailsComponent {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService
    ) {
    
  }
 
  editRisk(data: any) {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: {taskRole: 'edit' , risk: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadInitiative();
    });
  }
  async deleteRisk(risk: any) {
    this.deleteMitigationRisk(risk);
    await this.riskService.deleteRisk(risk.id);
    this.loadInitiative();
  }
  async deleteMitigationRisk(risk: any) {
    risk.mitigations.forEach( async (mitigation: any) => {
      await this.riskService.deleteMitigation(risk.id, mitigation.id);
    })
  }


  openPublishDialog() {
    this.dialog.open(PublishDialogComponent , {
      width: '600px',
    });
  }

  openNewRiskDialog() {
    const dialogRef = this.dialog.open(NewRiskComponent, {
      height: '90vh',
      data: {taskRole: 'add', initiative_id: Number(this.id)}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadInitiative()
    });
  }



  displayedColumns: string[] = ['ID', 'Risk Achieving Impact', 'Risk Category', 'Risk Owner', 'Description Risk', 'Current Likelihood', 'Current Impact', 'Current Risk Level', 'Target Likelihood', 'Target Impact', 'Target Risk Level', 'Mitigation Action', 'Status of Actions', 'Flag to SDG', 'Redundant', 'Actions'];
  dataSource: any = new MatTableDataSource<any>([]);
  initiative:any=null;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadInitiative() {
    this.initiative = await this.initiativeService.getInitiative(this.id);
    console.log(this.initiative)
    this.dataSource =  new MatTableDataSource<any>(this.initiative.risks);
  }
  versionId: any;
  initiativeId: any;
  id:number = 0;
  async ngOnInit() {
   
    this.activatedRoute.params.subscribe(params=>{
      this.versionId = params['versionId'];
      this.initiativeId = params['initiativeId'];
      this.id =  params['id'];
    })

    
    this.loadInitiative()
   

  }
  filterCategory(element: any) {
    var categories = '';
    element.categories.forEach((cat: any) => {
      categories += cat.title + " ";
    });
    return categories;
  }
  filterDescriptionMitigations(element: any) {
    var mitigationsList = '';
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList += mitigation.description + ",  ";
    })
    return mitigationsList
  }
  filterStatusMitigations(element: any) {
    var mitigationsList = '';
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList += mitigation.status + ",  ";
    })
    return mitigationsList
  }
  

 

}
