import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RiskService } from 'src/app/services/risk.service';
import { NewProposedComponent } from '../new-proposed/new-proposed.component';

@Component({
  selector: 'app-new-risk',
  templateUrl: './new-risk.component.html',
  styleUrls: ['./new-risk.component.scss']
})
export class NewRiskComponent {
  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewRiskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private riskService: RiskService
  ) {}

  
  riskApi: any = null;

  errorMessage: any = ''
  riskCategories: any;
  newRiskForm: any;

  populateNewRiskForm() {
    
    this.newRiskForm = this.fb.group({
      riskOwner: [(this.data.taskRole == 'add')? '' : this.data.risk.risk_owner, Validators.required],
      riskCategories: [(this.data.taskRole == 'add')? '' : this.data.risk.categories[0].id, Validators.required],
      riskTitle: [(this.data.taskRole == 'add')? '' : this.data.risk.title, Validators.required],
      detailedDescription: [(this.data.taskRole == 'add')? '' : this.data.risk.description, Validators.required],
      targetLikelihood: [(this.data.taskRole == 'add')? '' :  String(this.data.risk.target_likelihood), Validators.required],
      targetImpact: [(this.data.taskRole == 'add')? '' :  String(this.data.risk.target_impact), Validators.required],
      currentLikelihood: [(this.data.taskRole == 'add')? '' :  String(this.data.risk.likelihood), Validators.required],
      currentImpact: [(this.data.taskRole == 'add')? '' : String(this.data.risk.impact), Validators.required]
    })

    if(this.data.taskRole == 'edit') {

      this.proposed = new MatTableDataSource<any>(this.data.risk.mitigations);
    }
  }

  async submitPartOfRiskForm() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    if(this.newRiskForm.valid) {
      this.riskApi = await this.riskService.createNewRisk({
        initiative_id: Number(this.data.initiative_id), 
        risk_owner: this.newRiskForm.value.riskOwner,
        title: this.newRiskForm.value.riskTitle,
        description: this.newRiskForm.value.detailedDescription,
        target_likelihood: Number(this.newRiskForm.value.targetLikelihood),
        target_impact: Number(this.newRiskForm.value.targetImpact),
        likelihood: Number(this.newRiskForm.value.currentLikelihood),
        impact: Number(this.newRiskForm.value.currentImpact),
        categories: [{id: this.newRiskForm.value.riskCategories}],
      })
    } 
  }

  submit() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    if(this.proposed.data.length == 0) {
      this.errorMessage = "Proposed mitigation measurements is required"
    } else if(this.newRiskForm.valid) {
      this.errorMessage = '';
      if(this.data.taskRole == 'add') {
        this.dialog.closeAll();
      } else if(this.data.taskRole == 'edit') {
        // here we handle put api for risk
        this.riskService.updateRisk(this.data.risk.id, {
          id:  Number(this.data.risk.id),
          initiative_id: Number(this.data.risk.initiative_id),
          risk_owner: this.newRiskForm.value.riskOwner,
          title: this.newRiskForm.value.riskTitle,
          description: this.newRiskForm.value.detailedDescription,
          target_likelihood: Number(this.newRiskForm.value.targetLikelihood),
          target_impact: Number(this.newRiskForm.value.targetImpact),
          likelihood: Number(this.newRiskForm.value.currentLikelihood),
          impact: Number(this.newRiskForm.value.currentImpact),
          categories: [{id: this.newRiskForm.value.riskCategories}],
        })
        this.dialog.closeAll();
      }
      
    } 
  }

  arr: any[] = [];
  async openNewProposedDialog() {
    if(this.riskApi == null && this.data.taskRole == 'add') {
       await this.submitPartOfRiskForm()
    }
   
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'add', proposed: null}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(this.data.taskRole == 'add') {
        if(result.role == 'add') {
          this.errorMessage = '';
          await this.riskService.createNewMitigation(this.riskApi.id, {
            risk_id: this.riskApi.id,
            description: result.formValue.description,
            status: result.formValue.status
          })
          var risk: any = await this.riskService.getRisk(this.riskApi.id)
          this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
        }
      } else if(this.data.taskRole == 'edit'){
        this.errorMessage = '';
        await this.riskService.createNewMitigation(this.data.risk.id, {
          risk_id: this.data.risk.id,
          description: result.formValue.description,
          status: result.formValue.status
        })
        var risk: any = await this.riskService.getRisk(this.data.risk.id)
        this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
      }
      
    });
  }

  async removeProposed(mitigationId: any) {
    if(this.data.taskRole == 'add') {
      await this.riskService.deleteMitigation(this.riskApi.id, mitigationId)
      var risk: any = await this.riskService.getRisk(this.riskApi.id)
      this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
    } else if(this.data.taskRole == 'edit') {
      await this.riskService.deleteMitigation(this.data.risk.id, mitigationId)
      var risk: any = await this.riskService.getRisk(this.data.risk.id)
      this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
    }
    
  }

  editProposed(mitigationId: number, mitigation: any) {
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'edit', proposed: mitigation, mitigationId: mitigationId}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(this.data.taskRole == 'add') {
        if(result.role == 'edit') {
          this.errorMessage = '';
          await this.riskService.editMitigation(this.riskApi.id, mitigationId,  {
            risk_id: this.riskApi.id,
            description: result.formValue.description,
            status: result.formValue.status
          })
          var risk: any = await this.riskService.getRisk(this.riskApi.id)
          this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
        }
      } else if(this.data.taskRole == 'edit') {
        this.errorMessage = '';
        await this.riskService.editMitigation(this.data.risk.id, mitigationId,  {
          risk_id: this.data.risk.id,
          description: result.formValue.description,
          status: result.formValue.status
        })
        var risk: any = await this.riskService.getRisk(this.data.risk.id)
        this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
        
      }
      
    });
  }


  displayedColumns: string[] = ['Mitigation Description', 'Status of Action', 'Actions'];
  proposed = new MatTableDataSource<any>([]);



  async ngOnInit() {
    this.populateNewRiskForm()
    this.riskCategories = await this.riskService.getRiskCategories();
    
  }
}
