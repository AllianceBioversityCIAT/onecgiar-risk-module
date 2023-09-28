import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlossaryFormDialogComponent } from './glossary-form-dialog/glossary-form-dialog.component';
import { GlossaryService } from 'src/app/services/glossary.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-glossary-admin',
  templateUrl: './glossary-admin.component.html',
  styleUrls: ['./glossary-admin.component.scss'],
})
export class GlossaryAdminComponent implements OnInit {
  filters: any = null;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toster: ToastrService,
    private GlossaryService: GlossaryService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  data: any;
  dataSource: any;
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  filterForm: FormGroup = new FormGroup({});

  sort = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Name (lowest first)', value: 'title,ASC' },
    { name: 'Name (highest first)', value: 'title,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 1;
      this.filters = this.filterForm.value;
      this.getData();
    });
  }

  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];

  async ngOnInit() {
    this.filterForm = this.fb.group({
      title: [null],
      sort: [null],
    });
    await this.getData();
    this.setForm();
    this.title.setTitle('Glossary');
    this.meta.updateTag({
      name: 'description',
      content: 'Glossary',
    });
  }
  async getData() {
    this.data = await this.GlossaryService.getGlossary(
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
    this.getData();
  }

  openFormDialog(id: any, action: string) {
    const _popup = this.dialog.open(GlossaryFormDialogComponent, {
      width: '68rem',
      height: 'auto',
      data: {
        id: id,
        action: action,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      await this.getData();
    });
  }

  editGlossary(id: number, action: string) {
    this.openFormDialog(id, action);
  }

  deleteGlossary(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        title: 'Delete',
        message: `Are you sure you want to delete ${record.title}`,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response == true) {
        await this.GlossaryService.deleteGlossary(record.id);
        this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
