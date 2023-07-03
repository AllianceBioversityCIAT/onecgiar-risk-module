import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementFormComponent } from './announcement-form/announcement-form.component';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { SendEmailFormComponent } from './send-email-form/send-email-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
})
export class AnnouncementComponent implements OnInit {
  constructor(private dialog: MatDialog,private announcementService: AnnouncementService,
    private toster: ToastrService,
    ){}
  announcementData:any;


  ngOnInit(): void {
    this.getData();
  }


  displayedColumns: string[] = [
    'id',
    'subject',
    'description',
    'status',
    'created_at',
    'updated_at',
    'send_date',
    'actions'
  ];

  async getData() {
    this.announcementData = await this.announcementService.getAnnouncement();
  }


  openFormDialog(id:any){
    const _popup = this.dialog.open(AnnouncementFormComponent,{
      maxWidth:'750px',
      maxHeight: '650px',
      data:{
        id:id
      }
    });
    _popup.afterClosed().subscribe(response => {
      this.getData();
    });
  }

  editannouncement(id: number) {
    this.openFormDialog(id);
  }

  sendTest(id: number) {
    const _popup = this.dialog.open(SendEmailFormComponent,{
      width:'300px',
      maxHeight: '200px',
      data:{
        id:id,
      }
    });
    _popup.afterClosed().subscribe(response => {
      this.getData();
    });
  }

  sendAll(id: number, status: string) {
    const _popup = this.dialog.open(ConfirmComponent,{
      width:'auto',
      maxHeight: 'auto',
      data:{
        id:id,
        title:'Send to all users',
        message: 'Are you sure you want to send this Announcement to all users in the system?'
      }
    });
    _popup.afterClosed().subscribe(async response => {
      if(response == true) {
        await this.announcementService.updateAnnouncementStatus(id, status);
        this.getData();
        this.toster.success('Sent successfully');
      }
    });
  }
}
