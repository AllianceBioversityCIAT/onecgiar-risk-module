import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MitigationStatusFormDialogComponent } from './mitigation-status-form-dialog/mitigation-status-form-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mitigation-status',
  templateUrl: './mitigation-status.component.html',
  styleUrls: ['./mitigation-status.component.scss'],
})
export class MitigationStatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: any;
  filters: any = null;

  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
  dataSource: any;

  filterForm: FormGroup = new FormGroup({});

  sort = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Name (lowest first)', value: 'full_name,ASC' },
    { name: 'Name (highest first)', value: 'full_name,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.filters = this.filterForm.value;
      this.ngOnInit();
    });
  }

  constructor(
    private fb: FormBuilder,
    private toster: ToastrService,
    private mitigationService: MitigationStatusService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      email: [null],

      sort: [null],
    });
    this.getData();
    this.title.setTitle('Actions /Controls To Manage Risks');
    this.meta.updateTag({
      name: 'description',
      content: 'Actions /Controls To Manage Risks',
    });
  }

  async getData() {
    this.dataSource = await this.mitigationService.getMitigationStatus();
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
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

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
