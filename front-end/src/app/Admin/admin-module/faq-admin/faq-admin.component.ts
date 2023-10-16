import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaqFormDialogComponent } from './faq-form-dialog/faq-form-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FAQService } from 'src/app/services/faq.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-faq-admin',
  templateUrl: './faq-admin.component.html',
  styleUrls: ['./faq-admin.component.scss'],
})
export class FaqAdminComponent {
  filters: any = null;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toster: ToastrService,
    private FaqService: FAQService,
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
  filterForm: FormGroup = new FormGroup({});
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  displayedColumns: string[] = ['id', 'question', 'answer', 'actions'];

  sort = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Question (A to Z)', value: 'question,ASC' },
    { name: 'Question (Z to A)', value: 'question,DESC' },
    { name: 'Answer (A to Z)', value: 'answer,ASC' },
    { name: 'Answer (Z to A)', value: 'answer,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 1;
      this.filters = this.filterForm.value;
      this.getData();
    });
  }

  async ngOnInit() {
    this.filterForm = this.fb.group({
      search: [null],
      sort: [null],
    });
    await this.getData();
    this.setForm();
    this.title.setTitle('FAQ');
    this.meta.updateTag({
      name: 'description',
      content: 'FAQ',
    });
  }

  async getData() {
    this.data = await this.FaqService.getData(
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
    const _popup = this.dialog.open(FaqFormDialogComponent, {
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

  editFAQ(id: number, action: string) {
    this.openFormDialog(id, action);
  }

  deleteFAQ(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        title: 'Delete',
        message: `Are you sure you want to delete ${record.question}`,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response == true) {
        await this.FaqService.deleteFaq(record.id);
        this.getData();
        this.toster.success(`Delete ${record.answer} successfully`);
      }
    });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
