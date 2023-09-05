import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MitigationStatusFormDialogComponent } from './mitigation-status-form-dialog/mitigation-status-form-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-mitigation-status',
  templateUrl: './mitigation-status.component.html',
  styleUrls: ['./mitigation-status.component.scss'],
})
export class MitigationStatusComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
  dataSource: any;

  constructor(
    private toster: ToastrService,
    private mitigationService: MitigationStatusService,
    private dialog: MatDialog,
    private headerService: HeaderService
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    this.dataSource = await this.mitigationService.getMitigationStatus();
  }

  openFormDialog(element: any, action: string) {
    const _popup = this.dialog.open(MitigationStatusFormDialogComponent, {
      width: '68rem',
      height: '40rem',
      data: {
        element: element,
        action: action,
      },
    });
    _popup.afterClosed().subscribe((response) => {
      this.getData();
    });
  }

  editMitigation(element: any, action: string) {
    this.openFormDialog(element, action);
  }

  deleteMitigation(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        id: record.id,
        title: 'Delete',
        message: `Are you sure you want to delete this record ?`,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response == true) {
        await this.mitigationService.deleteMitigationStatus(record.id);
        await this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }
}
