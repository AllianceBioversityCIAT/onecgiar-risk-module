import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PhasesService } from 'src/app/services/phases.service';
import { PhaseDialogComponent } from './phase-dialog/phase-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
})
export class PhasesComponent implements OnInit {
  columnsToDisplay: string[] = [
    'id',
    'name',
    'reporting_year',
    'start_date',
    'end_date',
    'previous_phase',
    'status',
    'active',
    'actions',
  ];
  filters: any = null;
  dataSource: any;
  data: any;
  filterForm: FormGroup = new FormGroup({});
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;

  sortBtn = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Name (lowest first)', value: 'name,ASC' },
    { name: 'Name (highest first)', value: 'name,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 1;
      this.filters = this.filterForm.value;
      this.initTable();
    });
  }

  constructor(
    private fb: FormBuilder,
    private phasesService: PhasesService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      name: [null],
      sort: [null],
    });
    this.initTable();
    this.setForm();
    this.title.setTitle('Phases');
    this.meta.updateTag({
      name: 'description',
      content: 'Phases',
    });
  }

  async initTable() {
    this.data = await this.phasesService.getPhases(
      this.filters,
      this.pageIndex,
      this.pageSize
    );
    this.dataSource = this.data.result;
    this.length = this.data.count;
  }

  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initTable();
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(PhaseDialogComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }

  delete(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Delete',
          message: `Are you sure you want to delete this Phase item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.phasesService.deletePhase(id);
          if (result) this.initTable();
        }
      });
  }

  activate(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Activate',
          message: `Are you sure you want to activate this Phase item?`,
          svg: `../../../../assets/shared-image/checked-2.png`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.phasesService.activatePhase(id);
          if (result) this.initTable();
        }
      });
  }

  deactivate(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Deactivate',
          message: `Are you sure you want to deactivate this Phase item?`,
          svg: `../../../../assets/shared-image/disabled.png`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.phasesService.deactivatePhase(id);
          if (result) this.initTable();
        }
      });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
