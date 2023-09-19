import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { EmailsService } from 'src/app/services/emails.service';
import { FilterService } from 'src/app/filter.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmailBodyComponent } from './email-body/email-body.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss'],
})
export class EmailsComponent {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 15, 50, 100];
  totalEmailLogsCount = 0;

  visable = false;

  displayedColumns: string[] = [
    'id',
    'name',
    'subject',
    'email',
    'status',
    'createdAt',
    'action',
  ];
  emailLogs: any = [];
  formData: FormGroup = new FormGroup({});
  pipe = new DatePipe('en-US');
  filters: any = null;
  pageIndex: number = 1;
  data: any;

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {}

  constructor(
    private emailsService: EmailsService,
    private fb: FormBuilder,
    private emails: EmailsService,
    public dialog: MatDialog,
    private filterservice: FilterService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  showEmailBody() {
    this.visable = !this.visable;
  }

  sort = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Email (lowest first)', value: 'email,ASC' },
    { name: 'Email (highest first)', value: 'email,DESC' },
  ];

  populateFormData() {
    this.formData.valueChanges.subscribe(() => {
      this.filters = this.formData.value;
      this.getEmailLogs(this.pageIndex, this.pageSize);
    });
  }

  async pageChanged(event: any) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.data = await this.emails.getEmails(
      this.filters,
      this.pageIndex,
      this.pageSize
    );
    this.emailLogs = this.data.result;
    this.length = this.data.count;
  }

  async getEmailLogs(page: number, limit: number) {
    this.data = await this.emails.getEmails(this.filters, page, limit);

    this.emailLogs = this.data.result;
    this.length = this.data.count;
  }

  openShowEmailBodyDialog(data: any): void {
    const dialogRef = this.dialog.open(EmailBodyComponent, {
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  async refresh() {
    await this.getEmailLogs(this.pageIndex, this.pageSize);
    this.populateFormData();
  }

  openFilterDialog(data: any): void {}

  async ngOnInit() {
    this.formData = this.fb.group({
      search: [null],
      status: [null],
      sort: [null],
    });
    await this.getEmailLogs(this.pageIndex, this.pageSize);
    this.ngAfterViewInit();
    this.populateFormData();

    this.title.setTitle('Emails');
    this.meta.updateTag({
      name: 'description',
      content: 'Emails',
    });
  }

  resetForm() {
    this.formData.reset();
    this.formData.markAsUntouched();
  }
}
