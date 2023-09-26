import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
export class PhasesComponent implements AfterViewInit {
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
  phases: any = [];
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  filterForm: FormGroup = new FormGroup({});

  sortBtn = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Name (lowest first)', value: 'full_name,ASC' },
    { name: 'Name (highest first)', value: 'full_name,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
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

    this.filterForm = this.fb.group({
      email: [null],

      sort: [null],
    });
    this.initTable();
  }

  ngAfterViewInit() {
    this.filterForm = this.fb.group({
      email: [null],

      sort: [null],
    });
    this.initTable();
  }

  async initTable() {
    this.phases = await this.phasesService.getPhases();
    this.dataSource = new MatTableDataSource(this.phases);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.title.setTitle('Phases');
    this.meta.updateTag({
      name: 'description',
      content: 'Phases',
    });
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
