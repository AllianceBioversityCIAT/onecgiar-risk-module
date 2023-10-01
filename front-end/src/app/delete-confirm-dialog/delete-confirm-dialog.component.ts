import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RiskService } from '../services/risk.service';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
})
export class DeleteConfirmDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    private riskService: RiskService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  risks: any;

  ngOnInit(): void {
    this.risks = this.data?.risks
      ?.map((d: any) => d.original_risk_id || d.id)
      .join(',');
    console.log(this.risks);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
