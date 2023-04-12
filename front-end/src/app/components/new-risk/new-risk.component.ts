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
      riskOwner: [''],
      riskCategories: ['', Validators.required],
      riskTitle: ['', Validators.required],
      detailedDescription: ['', Validators.required],
      targetLikelihood: ['', Validators.required],
      targetImpact: ['', Validators.required],
      currentLikelihood: ['', Validators.required],
      currentImpact: ['', Validators.required]
    })
  }

  async submitPartOfRiskForm() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    if(this.newRiskForm.valid) {
      this.riskApi = await this.riskService.createNewRisk({
        initiative_id: Number(this.data.initiative_id), 
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
      this.errorMessage = "Proposed is Required"
    } else if(this.newRiskForm.valid) {
      this.errorMessage = '';
      this.dialog.closeAll();
    } 
  }

  arr: any[] = [];
  async openNewProposedDialog() {
    if(this.riskApi == null) {
       await this.submitPartOfRiskForm()
    }
   
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'add', proposed: null}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result.role == 'add') {
        this.errorMessage = '';
        await this.riskService.createNewMitigation(this.riskApi.id, {
          risk_id: this.riskApi.id,
          description: result.formValue.description,
          status: result.formValue.status
        })
        var risk: any = await this.riskService.getRisk(this.riskApi.id)
        this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
        console.log(this.proposed)
      } 
    });
  }

  async removeProposed(mitigationId: any) {
    await this.riskService.deleteMitigation(this.riskApi.id, mitigationId)
    var risk: any = await this.riskService.getRisk(this.riskApi.id)
    this.proposed = new MatTableDataSource<any>(risk[0].mitigations);
  }

  editProposed(mitigationId: number, mitigation: any) {
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'edit', proposed: mitigation, mitigationId: mitigationId}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
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
    });
  }


  displayedColumns: string[] = ['Mitigation Description', 'Status of Action', 'Actions'];
  proposed = new MatTableDataSource<any>([]);



  async ngOnInit() {
    this.populateNewRiskForm()
    this.riskCategories = await this.riskService.getRiskCategories();
    
  }
}
