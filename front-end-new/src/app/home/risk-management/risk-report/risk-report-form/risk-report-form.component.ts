import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiActionsControlsService } from 'src/app/shared-services/actions-controls-services/api-actions-controls.service';
import { ActionsControlsFormDialogComponent } from './actions-controls-form-dialog/actions-controls-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-risk-report-form',
  templateUrl: './risk-report-form.component.html',
  styleUrls: ['./risk-report-form.component.scss'],
})
export class RiskReportFormComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private apiActionsControlsService: ApiActionsControlsService,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource(
    this.apiActionsControlsService.actionsControlsData
  );

  displayedColumns: string[] = ['description', 'status', 'action'];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  riskReportFormData = new FormGroup({
    createdBy: new FormControl('', [Validators.required]),
    riskTitle: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    riskCategory: new FormControl('', [Validators.required]),
    riskOwner: new FormControl('', [Validators.required]),
    currentLikelihood: new FormControl('', [Validators.required]),
    currentImpact: new FormControl('', [Validators.required]),
    targetLikelihood: new FormControl('', [Validators.required]),
    targetImpact: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
  });

  openDialogCreateActionsControlsStatus(title: any) {
    this.dialog.open(ActionsControlsFormDialogComponent, {
      width: '68rem',
      height: '59.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditActionsControls(title: any, element: any) {
    this.dialog.open(ActionsControlsFormDialogComponent, {
      width: '68rem',
      height: '59.2rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteActionsControlsById(id: any) {
    this.apiActionsControlsService
      .openDialogDeleteActionsControls('Are you sure to delete this record ?')
      .afterClosed();
  }

  onSave() {}
}
