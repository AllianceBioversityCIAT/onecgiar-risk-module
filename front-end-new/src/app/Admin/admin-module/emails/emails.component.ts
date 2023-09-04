import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { EmailsService } from 'src/app/services/emails.service';
import { FilterService } from 'src/app/filter.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmailBodyComponent } from './email-body/email-body.component';
@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent {

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 15, 50, 100];
  totalEmailLogsCount = 0;
  
  visable = false;
  
  displayedColumns: string[] = ['id', 'name','subject', 'email', 'status', 'createdAt' , 'action'];
  emailLogs: any;
  formData: any;
  pipe = new DatePipe('en-US');

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
   
  }

  constructor(
    private emailsService: EmailsService,
    private fb: FormBuilder,
    private emails: EmailsService,
    public dialog: MatDialog,
    private filterservice: FilterService
  ) { }

  
  showEmailBody() {
    this.visable = !this.visable;
  }

  
  async populateFormData() {
    this.formData = await this.fb.group({
      search: [''],
      status: [true],
    })
    this.formData.get("search").valueChanges.subscribe(async (formValue: any) => {
      const emailLogsData = await this.emails.filterSearchEmails(formValue);
      this.emailLogs = new MatTableDataSource<any>(emailLogsData);
    })
    this.formData.get("status").valueChanges.subscribe(async (formValue: any) => {
      const emailLogsData = await this.emails.filterStatusEmails(formValue);
      this.emailLogs = emailLogsData
    })
  }

  async pageChanged(event: any) {
     var emailLogs = await this.emails.getEmails(++event.pageIndex , event.pageSize);
     this.emailLogs = emailLogs.items;
  }

  async getEmailLogs(page: number, limit: number) {
    const emailLogs = await this.emails.getEmails(page, limit);
    
    this.emailLogs = new MatTableDataSource<any>(emailLogs.items);
    this.length = emailLogs.meta.totalItems;
    this.pageSize = emailLogs.meta.itemsPerPage; 
    this.totalEmailLogsCount = emailLogs.meta.totalItems;
  }

  openShowEmailBodyDialog(data: any): void {
    const dialogRef = this.dialog.open(EmailBodyComponent, {
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
      }
    });
  }

  async refresh() {
    await this.getEmailLogs(1,10);
    this.populateFormData();
  }

  openFilterDialog(data: any): void {

  }

  async ngOnInit() {
    await this.getEmailLogs(1,10);
    this.ngAfterViewInit();
    this.populateFormData();
    
  }

}
