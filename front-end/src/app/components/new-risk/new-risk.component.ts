import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  errorMessage: any = ''
  riskCategories: any[] = [
    {value: '', viewValue: 'Choice Category'},
    {value: 'Cohesion', viewValue: 'Cohesion'},
    {value: 'Funding', viewValue: 'Funding'},
    {value: 'Operations', viewValue: 'Operations'},
    {value: 'Partners and Partnerships ', viewValue: 'Partners and Partnerships '},
    {value: 'Scaling and Impact', viewValue: 'Scaling and Impact'},
    {value: 'Science Research & Innovation', viewValue: 'Science Research & Innovation'},
    {value: 'Talent', viewValue: 'Talent'}
  ];

  newRiskForm: any;
  populateNewRiskForm() {
    
    this.newRiskForm = this.fb.group({
      riskOwner: ['' , Validators.required],
      riskCategories: ['', Validators.required],
      riskTitle: ['', Validators.required],
      detailedDescription: ['', Validators.required],
      targetLikelihood: ['', Validators.required],
      targetImpact: ['', Validators.required],
      targetRiskLevel: ['', Validators.required],
      currentLikelihood: ['', Validators.required],
      currentImpact: ['', Validators.required],
      currentRiskLevel: ['', Validators.required]
    })
  }


  submit() {
    this.newRiskForm.markAllAsTouched();
    this.newRiskForm.updateValueAndValidity();
    if(this.proposed.data.length == 0) {
      this.errorMessage = "Proposed is Required"
    } else if(this.newRiskForm.valid) {
      this.errorMessage = '';

    } 
  }

  arr: any[] = [];
  openNewProposedDialog() {
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'add', proposed: null}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.role == 'add') {
        this.errorMessage = '';
        this.arr.push({"Mitigation Description": result.formValue.mitigationDescription, "Status of Action": result.formValue.statusOfAction})
        this.proposed = new MatTableDataSource<any>(this.arr);
      } else {
        console.log(result.index)
        this.arr.splice(result.index, 1)
        this.errorMessage = '';
        this.arr.push({"Mitigation Description": result.formValue.mitigationDescription, "Status of Action": result.formValue.statusOfAction})
        this.proposed = new MatTableDataSource<any>(this.arr);
      }
    });
  }

  removeProposed(index: any) {
    this.arr.splice(index, 1)
    this.proposed = new MatTableDataSource<any>(this.arr);
  }

  editProposed(index: any, proposed: any) {
    const dialogRef = this.dialog.open(NewProposedComponent, {
      width: '600px',
      data: {role: 'edit', proposed: proposed, index: index}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.role == 'add') {
        this.errorMessage = '';
        this.arr.push({"Mitigation Description": result.formValue.mitigationDescription, "Status of Action": result.formValue.statusOfAction})
        this.proposed = new MatTableDataSource<any>(this.arr);
      } else {
        console.log(result.index)
        this.arr.splice(result.index, 1)
        this.errorMessage = '';
        this.arr.push({"Mitigation Description": result.formValue.mitigationDescription, "Status of Action": result.formValue.statusOfAction})
        this.proposed = new MatTableDataSource<any>(this.arr);
      }
    });
  }


  displayedColumns: string[] = ['Mitigation Description', 'Status of Action', 'Actions'];
  proposed = new MatTableDataSource<any>([]);



  ngOnInit() {
    this.populateNewRiskForm()
  }
}
