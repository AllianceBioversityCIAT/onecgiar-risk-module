import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiAnnouncementService } from 'src/app/shared-services/admin-services/Announcements-Services/api-announcement.service';
import { AnnouncementsFormDialogComponent } from './announcements-form-dialog/announcements-form-dialog.component';
import { Announcement } from 'src/app/shared-model/Parameters-settings-Data/announcement.model';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss'],
})
export class DraftsComponent implements OnInit {
  constructor(
    private apiAnnouncement: ApiAnnouncementService,
    private dialog: MatDialog
  ) {}

  announcements: Announcement[] = [];

  ngOnInit() {
    this.announcements = this.apiAnnouncement.announcementData;
  }

  onSendAnnouncement() {}

  openDialogCreateAnnouncement(title: any) {
    this.dialog.open(AnnouncementsFormDialogComponent, {
      width: '68rem',
      height: '45.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditAnnouncement(title: any, element: any) {
    this.dialog.open(AnnouncementsFormDialogComponent, {
      width: '68rem',
      height: '49.2rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteAnnouncementById(id: any) {
    this.apiAnnouncement
      .openDialogDeleteAnnouncement('Are you sure to delete this record ?')
      .afterClosed();
  }
}
