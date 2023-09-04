import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Announcement } from 'src/app/shared-model/Parameters-settings-Data/announcement.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ApiAnnouncementService {
  announcementData: Announcement[] = [
    new Announcement(
      1,
      '2023-05-10',
      '9:14a.m CEST',
      'New mitigation',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`
    ),
    new Announcement(
      2,
      '2023-05-10',
      '9:14a.m CEST',
      'New mitigation',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`
    ),
    new Announcement(
      3,
      '2023-05-10',
      '9:14a.m CEST',
      'New mitigation',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`
    ),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteAnnouncement(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
