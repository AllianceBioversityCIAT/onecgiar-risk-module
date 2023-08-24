import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiMitigationStatusService } from 'src/app/shared-services/admin-services/Parameters-settings-Services/api-mitigation-status.service';

import { MitigationStatusFormDialogComponent } from './mitigation-status-form-dialog/mitigation-status-form-dialog.component';

@Component({
  selector: 'app-mitigation-status',
  templateUrl: './mitigation-status.component.html',
  styleUrls: ['./mitigation-status.component.scss'],
})
export class MitigationStatusComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  displayedColumns: string[] = [
    'color',
    'id',
    'mitigationStatus',
    'description',

    'actions',
  ];

  constructor(
    private apiMitigationStatus: ApiMitigationStatusService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(
    this.apiMitigationStatus.mitigationStatusData
  );

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogCreateMitigationStatus(title: any) {
    this.dialog.open(MitigationStatusFormDialogComponent, {
      width: '68rem',
      height: '45.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditMitigationStatus(title: any, element: any) {
    this.dialog.open(MitigationStatusFormDialogComponent, {
      width: '68rem',
      height: '45.2rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteMitigationById(id: any) {
    this.apiMitigationStatus
      .openDialogDeleteMitigationStatus('Are you sure to delete this record ?')
      .afterClosed();
  }
}
